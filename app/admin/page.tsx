import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/signout-button";

export const metadata = {
  title: "Perfil",
};

const AdminPage = async () => {
  const session = await auth();
  // console.log("Session:", session);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {session.user.email}</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
};

export default AdminPage;
