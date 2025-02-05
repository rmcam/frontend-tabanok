// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";


// import { CardWrapper } from "@/components/auth/card-wrapper";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { signInSchema } from "@/lib/zod";
// import { signIn } from "next-auth/react";

// export const RegisterForm = () => {
//   const router = useRouter();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, setIsPending] = useState(false); // Estado de carga;

//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       email: "admin@admin.com",
//       password: "admin123",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof signInSchema>) {
//     setError(undefined);
//     setSuccess(undefined);
//     setIsPending(true); // Activar estado de carga

//     try {
//       const response = await signIn();
//       if (response.error) {
//         setError(response.error);
//       } else {
//         setSuccess("¡Inicio de sesión exitoso!");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Ocurrió un error en el servidor");
//     } finally {
//       setIsPending(false); // Desactivar estado de carga
//     }
//   }
//   return (
//     <CardWrapper
//       headerLabel="Welcome back"
//       backButtonLabel="Don't have an account?"
//       backButtonHref="/sign-up"
//       showSocial
//     >
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-6"
//         >
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="admin@admin.com"
//                       type="email"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="*********"
//                       type="password"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/** Mensajes de Error/Éxito */}
//             <FormError message={error} />
//             <FormSuccess message={success} />
//             {/** Botón de Enviar */}
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="w-full"
//             >
//               {isPending ? "Loading..." : "Login"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </CardWrapper>
//   );
// };
