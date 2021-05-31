<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "../store/user";
    import { createClient } from '@supabase/supabase-js'

    const supabaseUrl = 'https://iupdirgjypmgamuxcneh.supabase.co'
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDU3NTk3NywiZXhwIjoxOTM2MTUxOTc3fQ.GJvfqCz723_XySApQrVFoQxie-1kh9S6gQGnuKqtYRA'
    const supabase = createClient(supabaseUrl, SUPABASE_KEY)
  
    const navigate = useNavigate();
    const location = useLocation();
  
    let username;
    let password;
    let passwordVerify;
  
    async function handleSubmit(e) {
      e.preventDefault();

      if (password !== passwordVerify) {
          alert ('Password are not the same!');
      }

      const from = ($location.state && $location.state.from) || "/";

      let {res, error } = await supabase.auth.signIn({
        email: username,
        password: password
      })
      
      if(error) {
          console.log(error);
          alert(error.message);
      }else {
        $user = res
        navigate(from, { replace: true });
      }
    }
</script>

<h3>Login</h3>
<form>
  <input
    bind:value={username}
    type="text"
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
  <input
    bind:value={passwordVerify}
    type="password"
    name="password-verify"
    placeholder="Password Again"
  />
  <br />
  <button type="submit" on:click={handleSubmit}>Login</button>
</form>