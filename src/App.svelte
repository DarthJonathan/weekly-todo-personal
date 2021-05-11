<script>
	export let name;
	
	import { Router, Route, Link } from "svelte-navigator";
	import Login from "./pages/Login.svelte";
	import PrivateLayout from "./layout/PrivateLayout.svelte";
    import { user } from "./store/user";

	function handleLogout() {
		$user = null;
  	}
</script>

<Router>
	<main>
		<h1>Hello {name}!</h1>
		<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

		<nav>
			<Link to="/">Home</Link>
			<Link to="about">About</Link>
			<Link to="profile">Profile</Link>
			<Link to="login">Login</Link>
			<Link to="todo">Todo</Link>
		</nav>

		<main>
			<Route path="login">
				<Login />
			</Route>
		
			<Route path="/">
				<h3>Home</h3>
				<p>Home sweet home...</p>
			</Route>
		
			<Route path="about">
				<h3>About</h3>
				<p>That's what it's all about!</p>
			</Route>
		
			<PrivateLayout path="todo" let:location>
				<h3>Welcome {$user.username}</h3>
				<button on:click={handleLogout}>Logout</button>
			</PrivateLayout>
		</main>
	</main>
</Router>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>