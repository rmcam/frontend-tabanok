export function useAuth() {
  const handleLogout = () => {
    // Implement actual logout logic here
    console.log("Cerrar sesión")
    // Redirect to login page or home page after logout
    // navigate("/login");
  }

  return { handleLogout }
}
