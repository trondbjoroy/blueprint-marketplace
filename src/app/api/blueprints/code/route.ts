import { NextRequest, NextResponse } from 'next/server';

const ORG = 'HathorNetwork';
const REPO = 'community-blueprints';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const issueNumber = searchParams.get('issue');
  
  if (!issueNumber) {
    return NextResponse.json({ error: 'Issue number required' }, { status: 400 });
  }

  try {
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${ORG}/${REPO}/commits?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
        },
      }
    );

    if (!commitsResponse.ok) {
      throw new Error('Failed to fetch commits');
    }

    const commits = await commitsResponse.json();
    
    const relevantCommit = commits.find((commit: any) => {
      const message = commit.commit?.message?.toLowerCase() || '';
      return message.includes(`#${issueNumber}`) || 
             message.includes(`issue ${issueNumber}`) ||
             message.includes(`blueprint`) && message.includes(issueNumber);
    });

    if (relevantCommit) {
      const commitDetailsResponse = await fetch(
        `https://api.github.com/repos/${ORG}/${REPO}/commits/${relevantCommit.sha}`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
          },
        }
      );

      if (commitDetailsResponse.ok) {
        const commitDetails = await commitDetailsResponse.json();
        const blueprintFile = commitDetails.files?.find((file: any) => 
          file.filename.endsWith('.py') || 
          file.filename.includes('blueprint')
        );

        if (blueprintFile?.raw_url) {
          const codeResponse = await fetch(blueprintFile.raw_url);
          
          if (codeResponse.ok) {
            const code = await codeResponse.text();
            return NextResponse.json({ code, source: 'commit', filename: blueprintFile.filename });
          }
        }
      }
    }

    const treeResponse = await fetch(
      `https://api.github.com/repos/${ORG}/${REPO}/git/trees/master?recursive=1`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
        },
      }
    );

    if (treeResponse.ok) {
      const tree = await treeResponse.json();
      const blueprintFiles = tree.tree?.filter((item: any) => 
        item.path.includes('blueprints/') && item.path.endsWith('.py')
      ) || [];

      for (const file of blueprintFiles) {
        const contentResponse = await fetch(
          `https://api.github.com/repos/${ORG}/${REPO}/contents/${file.path}`,
          {
            headers: {
              'Accept': 'application/vnd.github.raw',
            },
          }
        );

        if (contentResponse.ok) {
          const code = await contentResponse.text();
          if (code.includes(`issue ${issueNumber}`) || code.includes(`#${issueNumber}`)) {
            return NextResponse.json({ code, source: 'file', filename: file.path });
          }
        }
      }

      if (blueprintFiles.length > 0) {
        const firstFile = blueprintFiles[0];
        const contentResponse = await fetch(
          `https://api.github.com/repos/${ORG}/${REPO}/contents/${firstFile.path}`,
          {
            headers: {
              'Accept': 'application/vnd.github.raw',
            },
          }
        );

        if (contentResponse.ok) {
          const code = await contentResponse.text();
          return NextResponse.json({ code, source: 'file', filename: firstFile.path });
        }
      }
    }

    return NextResponse.json({ 
      error: 'No blueprint code found', 
      code: null 
    }, { status: 404 });

  } catch (error) {
    console.error('Error fetching blueprint code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprint code' },
      { status: 500 }
    );
  }
}
