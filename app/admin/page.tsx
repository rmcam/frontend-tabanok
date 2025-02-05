import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/signout-button";

const AdminPage = async () => {
  const session = await auth();
  // console.log("Session:", session);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {session.user.name}</h1>
      <p>Rol: {session.user.role}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
};

export default AdminPage;
