<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import supabase from '../util/supabase-util';

    const navigate = useNavigate();
    const location = useLocation();
    const user = supabase.auth.user();

    $: if (!user || !user.id) {
        navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
        });
    }
</script>

{#if user && user.id}
    <slot />
{/if}
