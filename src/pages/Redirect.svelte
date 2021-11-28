<script>
	import { useNavigate } from "svelte-navigator";
    import supabase from '../util/supabase-util';
    
    let navigate = useNavigate();
    let user = supabase.auth.user();

    if (user && user.id) {
        navigate("/", { replace: true });
    }else {
        navigate("/login", { replace: true });
    }
</script>