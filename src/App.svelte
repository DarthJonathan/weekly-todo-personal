<script>
	export let name;
	
	import { Router, Route, Link } from "svelte-navigator";
	import Login from "./pages/Login.svelte";
	import PrivateLayout from "./layout/PrivateLayout.svelte";
    import { user } from "./store/user";
	import Todo from "./pages/Todo.svelte";

	function handleLogout() {
		$user = null;
  	}
</script>

<Router>
	<main>
		<!-- <nav>
			<Link to="/">Home</Link>
			<Link to="about">About</Link>
			<Link to="profile">Profile</Link>
			<Link to="login">Login</Link>
			<Link to="todo">Todo</Link>
		</nav> -->

		<main>
			<Route path="login">
				<Login />
			</Route>
		
			<Route path="/">
				<Todo />
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
		min-height: 100vh;
		text-align: center;
		padding: 0;
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