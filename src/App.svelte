<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Login from "./pages/Login.svelte";
	import Register from "./pages/Register.svelte";
	import PrivateLayout from "./layout/PrivateLayout.svelte";
    import { userStore } from "./store/user";
	import Todo from "./pages/Todo.svelte";

	function handleLogout() {
		$userStore = null;
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

			<Route path="register">
				<Register />
			</Route>
		
			<PrivateLayout path="/" let:location>
				<Todo />
			</PrivateLayout>
		
			<PrivateLayout path="todo" let:location>
				<h3>Welcome {$userStore.username}</h3>
				<button on:click={handleLogout}>Logout</button>
			</PrivateLayout>
		</main>
	</main>
</Router>

<style>
	main {
		min-height: 100vh;
		text-align: left;
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