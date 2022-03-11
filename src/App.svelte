<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Login from "./pages/Login.svelte";
	import Register from "./pages/Register.svelte";
	import Redirect from "./pages/Redirect.svelte";
	import PrivateLayout from "./layout/PrivateLayout.svelte";
	import Todo from "./pages/Todo.svelte";
    import supabase from './util/supabase-util';

	function handleLogout() {
		supabase.auth.signOut().then(() => {
			window.location.href = "/login";
		});
  	}
</script>

<Router>
	<main>
		<!-- <nav>
			<Link to="/">TODO</Link>
			<Link to="about">About</Link>
			<Link to="profile">Profile</Link>
			<Link to="login">Login</Link>
			<Link to="todo">Todo</Link>
		</nav> -->

		<main>
			<Route path="login">
				<Login />
			</Route>

			<Route path="register">
				<Register />
			</Route>

			<Route path="redirect">
				<Redirect />
			</Route>
		
			<PrivateLayout path="/" let:location>
				<Todo />
			</PrivateLayout>
		
			<PrivateLayout path="/logout" let:location>
				<button on:click={handleLogout}>Logout</button>
			</PrivateLayout>
		</main>
	</main>
</Router>

<style>
	main {
		text-align: left;
		padding: 0;
		max-width: none;
		margin: 0 auto;
		overflow-y: hidden;
		height: 100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>