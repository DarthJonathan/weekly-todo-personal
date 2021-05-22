<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { userStore } from "../store/user";
    import supabase from '../util/supabase-util';
  
    const navigate = useNavigate();
    const location = useLocation();
  
    let username;
    let password;
  
    async function handleSubmit(e) {
      e.preventDefault();

      const from = ($location.state && $location.state.from) || "/";

      let {user, error } = await supabase.auth.signUp({
        email: username,
        password: password
      })

      console.log(user);
      
      if(error) {
          console.log(error);
          alert(error.message);
      }else {
        $userStore = user
        navigate(from, { replace: true });
      }
    }
</script>

<h3>Register</h3>
<form>
    <input
        bind:value={username}
        type="email"
        name="username"
        placeholder="Username"
    />
    <br />
    <input
        bind:value={password}
        type="password"
        name="password"
        placeholder="Password"
    />
    <br />
  <button type="submit" on:click={handleSubmit}>Register</button>
</form>