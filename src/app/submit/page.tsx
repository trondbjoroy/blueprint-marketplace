import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function SubmitPage() {
  redirect('https://github.com/HathorNetwork/community-blueprints');
}
