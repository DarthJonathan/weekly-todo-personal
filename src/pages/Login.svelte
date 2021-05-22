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

      let {user, error } = await supabase.auth.signIn({
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

    async function handleGithub(e) {
      e.preventDefault();

      const from = ($location.state && $location.state.from) || "/";

      let {user, error} = await supabase.auth.signIn({
        provider: 'github'
      })
      
      console.log(user)

      if(error) {
          console.log(error);
          alert(error.message);
      }else {
        $userStore = user
        navigate(from, { replace: true });
      }
    }
</script>

<h3>Login</h3>
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
  <button on:click={handleGithub}>Github Sign In</button>
  <button type="submit" on:click={handleSubmit}>Login</button>
</form>