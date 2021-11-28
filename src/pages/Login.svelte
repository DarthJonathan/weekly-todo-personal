<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import supabase from '../util/supabase-util';
    import { 
      FluidForm,
      FormGroup,
      TextInput,
      PasswordInput,
      InlineNotification,
      Content,
      Button,
      Row,
      Column,
      ButtonSet
    } from 'carbon-components-svelte';
    import ArrowRight32 from "carbon-icons-svelte/lib/ArrowRight32";
    import { expoIn } from "svelte/easing";
    import * as yup from 'yup';
  
    const navigate = useNavigate();
    const location = useLocation();
  
    let username;
    let password;
    let errors = {};
    let errorMessage = "";
    let isValid;

    let schema = yup.object().shape({
        password: yup.string().required().max(30),
        username: yup.string().required().email(),
    });
    
    const extractErrors = err => {
        return err.inner.reduce((acc, err) => {
            return { ...acc, [err.path]: err.message };
        }, {});
    };
  
    async function handleGithub(e) {
        e.preventDefault();

        const from = ($location.state && $location.state.from) || "/";

        let {user, error} = await supabase.auth.signIn({
            provider: "github"
        }, {
            redirectTo: env_vars.env.BASE_URL + "/redirect"
        })

        if(error) {
            console.log(error);
            errorMessage = error.message;
        }else {
            navigate(from, { replace: true });
        }
    }
  
    async function handleSubmit(e) {
        e.preventDefault();

        isValid = schema.isValidSync({username: username, password: password});

        schema
            .validate({username: username, password: password}, { abortEarly: false })
            .then(() => {
                errors = {}
            })
            .catch(err => {
                errors = extractErrors(err);
            })

        if (!isValid) {
            return
        }

        const from = ($location.state && $location.state.from) || "/";

        let {user, error} = await supabase.auth.signIn({
            email: username,
            password: password
        }, {
            redirectTo: env_vars.env.BASE_URL + "/redirect"
        })
        
        console.log(error);

        if(error) {
            console.log(error);
            errorMessage = error.message;
        }else {
            navigate(from, { replace: true });
        }
    }
</script>

<div style="position: relative; top: 50vh; transform: translateY(-50%);">
    <Content style="display: block">
        <Row>
            <Column
                xs={12}
                sm={12}
                md={6}
                lg={5}
            > 
                <h1>
                    Login
                </h1>
                
                <br/>
                <br/>

                <FluidForm>
                    {#if errorMessage !== ''}
                        <div in:expoIn>
                            <InlineNotification
                                title="Error:"
                                subtitle={errorMessage}
                            />
                        </div>
                        <br/>
                    {/if}

                    <FormGroup>
                        <TextInput
                            invalid={errors['username']}
                            invalidText={errors['username'] ? errors['username'] : ''}
                            labelText="Username"
                            type="text"
                            name="username"
                            id="username"
                            class="py-3"
                            on:input={(e) => username = e.target.value}
                            placeholder="user@trakkie.id" />
                    </FormGroup>
                    <FormGroup>
                        <PasswordInput
                            invalid={errors['password']}
                            invalidText={errors['password'] ? errors['password'] : ''}
                            labelText="Password"
                            type="password"
                            name="password"
                            id="password"
                            class="py-3"
                            on:input={(e) => password = e.target.value}
                            placeholder="Password" />
                    </FormGroup>
                    
                    <Row>
                        <Column>
                            <ButtonSet>
                                <Button style="width:50%; max-width: 50%" icon={ArrowRight32} kind="secondary" on:click={handleGithub}>Github</Button>
                                <Button style="width:50%; max-width: 50%" icon={ArrowRight32} on:click={handleSubmit}>Sign In</Button>
                            </ButtonSet>
                        </Column>
                    </Row>
                </FluidForm>
            </Column>
        </Row>
    </Content>
</div>