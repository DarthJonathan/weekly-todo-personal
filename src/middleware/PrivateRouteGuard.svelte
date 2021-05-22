<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { userStore } from "../store/user";

    const navigate = useNavigate();
    const location = useLocation();

    console.log($userStore)

    $: if (!$userStore.id) {
        navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
        });
    }
</script>

{#if $userStore.id}
    <slot />
{/if}
