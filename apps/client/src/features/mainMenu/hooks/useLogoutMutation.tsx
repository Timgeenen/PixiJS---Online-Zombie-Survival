import { useMutation } from "@tanstack/react-query"
import { logout } from "../services/logoutService"

function useLogoutMutation() {
    return useMutation({
        mutationFn: logout
    })    
}

export default useLogoutMutation
