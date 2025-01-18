// "use client"
 
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import Link from "next/link"
// import { use, useState } from "react"
// import { useDebounceValue } from 'usehooks-ts'
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { set } from "mongoose"
// import axios, {AxiosError} from "axios"



// const form = () => {
//     const [username, setUsername] = useState('')
//     const [usernameMessage, setUsernameMessage] = useState('')
//     const [isCheckingUsername, setIsCheckingUsername] = useState(false)
//     const [isSubmitting, setIsSubmitting] = useState(false)

//     const debouncedusername = useDebounceValue(username, 300)
//     const { toast } = useToast()
//     const router = useRouter()

//     //zod implementations

//     const form = useForm({
//         resolver: zodResolver(
//             z.object({
//                 username: z.string().min(3).max(20)
//             })
//         ),
//         defaultValues: {
//             username: '',
//             email : '',
//             password: ''
//         }
//     })

//     useEffect(() => {
//         const checkUsernameUnique = async () => {
//             if (debouncedusername) {
//                 setIsCheckingUsername(true)
//                 setUsernameMessage('')
//                 try {
//                     const response = await axios.get(`/api/auth/username/${debouncedusername}`)
//                     setUsernameMessage(response.data.message)
//                 } catch (error) {
//                     const AxiosError = error as AxiosError;
//                         setUsernameMessage(AxiosError.response?.data.message ?? 'Username already exists')
//                     } finally {
//                         setIsCheckingUsername(false)
//                     }
//                 }


//   return (
//     <div>form</div>
//   )
// }

// export default form