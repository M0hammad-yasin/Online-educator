import { useAuthUser } from "../module/authentication/store/authStore";


const useRole=()=>{
    const { role: currentRole } = useAuthUser() || {};
    return currentRole;}
export default useRole;