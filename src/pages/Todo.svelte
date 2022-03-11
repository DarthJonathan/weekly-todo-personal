<script>
    import { 
        Grid, 
        Row, 
        Column, 
        ClickableTile, 
        Content,
        Button,
        Header,
        HeaderNav,
        HeaderNavItem,
        HeaderNavMenu,
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavMenuItem,
        SideNavLink,
        SkipToContent
    } from "carbon-components-svelte";
    import {dndzone} from "svelte-dnd-action";
    import {flip} from "svelte/animate";
    import moment from 'moment';
    import { onMount } from 'svelte';
    import supabase from '../util/supabase-util';
    import ChevronRight32 from "carbon-icons-svelte/lib/ChevronRight32";
    import ChevronLeft32 from "carbon-icons-svelte/lib/ChevronLeft32";
    import Edit20 from "carbon-icons-svelte/lib/Edit20";
    import Delete20 from "carbon-icons-svelte/lib/Delete20";

    let todo = {}
    let finalConsideration = 0
    let user = supabase.auth.user()
    let isSideNavOpen = false;

    onMount(async () => {
        let { data: todoList, error } = await supabase
            .from('todo')
            .select('*')
            .gt('date', moment().add(-30, 'd').format('yyyyMMDD'))
            .eq('user_id', user.id)

        if (error == undefined) {
            for(let i = 0; i < todoList.length; i++) {
                let date = moment(todoList[i].date).format('yyyyMMDD')
                
                if (todo[date] == undefined) {
                    todo[date] = []
                }

                todo[date] = todo[date].concat([todoList[i]])
            }
        }
    })

    let modifier = 0
    const flipDurationMs = 200;

    function handleDndConsiderCards(date, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        todo[key] = e.detail.items;
        finalConsideration = date;
    }

    async function handleDndFinalizeCards(date, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        let oldItems = todo[key]
        todo[key] = e.detail.items;

        for(let i = 0; i < todo[key].length; i++) {
            let idx = oldItems.findIndex(c => c.id === todo[key][i].id);

            if (idx === undefined || idx === 0) {
                //Updates the date for id
                let item = todo[key][i]
                let considerDate = moment().add(finalConsideration, 'd').add(modifier, 'd').format('yyyyMMDD')

                const { data, error } = await supabase
                            .from('todo')
                            .update({ date: considerDate })
                            .eq('id', item.id)

                if (error !== null) {
                    alert('unable to update!');
                    console.log(error)
                }
            }
        }
    }

    async function handleClick(date, item) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        let todoId = document.getElementById(key + item.id);

        if(todoId.getAttribute('contenteditable') == 'true') {
            return;
        }

        const idx = todo[key].findIndex(c => c.id === item.id);
        todo[key][idx].done = !todo[key][idx].done;

        const { data, error } = await supabase
                    .from('todo')
                    .update({ done: todo[key][idx].done })
                    .eq('id', item.id)

        if (error !== null) {
            alert('unable to update done!');
        }
    }

    async function handleEdit(date, item, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        let todoId = document.getElementById(key + item.id);

        if(todoId.getAttribute('contenteditable') == 'true') {
            const idx = todo[key].findIndex(c => c.id === item.id);
            todo[key][idx].action = todoId.textContent;

            todoId.setAttribute('contenteditable', 'false');

            const { data, error } = await supabase
                        .from('todo')
                        .update({ action: todo[key][idx].action })
                        .eq('id', item.id)

            if (error !== null) {
                alert('unable to update!');
                console.log(error)
            }
        }else {
            todoId.setAttribute('contenteditable', 'true');
        }
    }

    async function onKeyPress(date, item, e) {
        if (e.charCode == 13) {
            let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
            let todoId = document.getElementById(key + item.id);
            const idx = todo[key].findIndex(c => c.id === item.id);
            todo[key][idx].action = todoId.textContent;
            todoId.setAttribute('contenteditable', 'false');

            const { data, error } = await supabase
                        .from('todo')
                        .update({ action: todo[key][idx].action })
                        .eq('id', item.id)

            if (error !== null) {
                alert('unable to update!');
                console.log(error)
            }
        }
    }

    async function handleDelete(date, item, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        const result = todo[key].filter(c => c.id !== item.id);
        todo[key] = result;

        const { data, error } = await supabase
                    .from('todo')
                    .delete()
                    .eq('id', item.id)

        if (error !== null) {
            alert('unable to delete!');
            console.log(error)
        }
    }

    function handleBackDate() {
        modifier -= 1 
    }

    function handleFrontDate() {
        modifier += 1 
    }

    async function handleNew(row, node) {
        let key = moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')
        if (node.target.classList.contains('column-content')) {
            //Add new clickable tile 
            if (todo[key] === undefined) {
                todo[key] = []
            }
            todo[key] = todo[key].concat([{
                id: 'placeholder-id', action: "", done: false
            }])

            const { data, error } = await supabase
            .from('todo')
            .insert([
                { action: '', user_id: user.id, date: moment().add(row, 'd').add(modifier, 'd') },
            ])

            for(let i = 0; i < todo[key].length; i++) {
                if (todo[key][i].id === 'placeholder-id') {
                    todo[key][i].id = data[0].id
                }
            }
        }
    }

    function handleLogout() {
        supabase.auth.signOut().then(() => {
            window.location.href = "/login";
        });
    }
</script>

<Header
    company="TO:DO"
    platformName={user.email}
    bind:isSideNavOpen
>
    <HeaderNav>
        <HeaderNavItem text="Logout" on:click={handleLogout} />
    </HeaderNav>
</Header>

<Content style="height: 100%">
    <Grid padding={true} style="padding-top:1em; height: 100%;">
        <Row>
            <Column style="text-align:left;">
                <ChevronLeft32 style="fill: blue" on:click={handleBackDate} />
            </Column>
            <Column style="text-align:center; outline: none;">
                <h2>TO:DO</h2>
            </Column>
            <Column style="text-align:right;">
                <ChevronRight32 style="fill: blue" on:click={handleFrontDate} />
            </Column>
        </Row>
        <br />
        <Row style="height: 100%;">
            {#each Array(5) as _, row}
                <Column 
                    sm={12}
                    md={4}
                    max={3}
                    classname="day" 
                    style="overflow-y: scroll; min-height: 100%; padding-bottom: 1em;"
                >
                    <div class="mb-3" style="text-align:center">
                        <h3>
                            {moment().add(row, 'd').add(modifier, 'd').format('dddd')}
                        </h3>
                    </div>
                    <div class="column-content" on:click={(e) => handleNew(row, e)} use:dndzone="{{items: todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [], flipDurationMs, dropTargetStyle: {outline: 'rgba(125, 125, 125, 0.3) solid 1.5px'}}}" on:consider="{(e) => handleDndConsiderCards(row,e)}" on:finalize="{(e) => handleDndFinalizeCards(row,e)}">
                        {#each todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [] as item(item.id)}
                            <div style="padding-top:1em;" class="card" animate:flip="{{duration: flipDurationMs}}" on:keypress={(e) => onKeyPress(row, item, e)}>
                                {#if item.done}
                                    <ClickableTile 
                                        id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                        disabled 
                                        on:click={handleClick(row, item)}
                                        style="min-height: 100px;"
                                    >
                                        <strike>
                                            {item.action}
                                        </strike>
                                    </ClickableTile>
                                {:else}
                                    <ClickableTile 
                                        id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                        on:click={handleClick(row, item)}
                                        style="min-height: 100px;"
                                    >{item.action}</ClickableTile>
                                {/if}
                                <div class="button-tile">
                                    <Button style="width: 50%;" on:click={(e) => handleEdit(row, item, e)}>
                                        <Edit20 />
                                    </Button>
                                    <Button style="width: 50%;" on:click={(e) => handleDelete(row, item, e)}>
                                        <Delete20 />
                                    </Button>
                                </div>
                                <hr style="border-bottom: solid 1px #000"/>
                            </div>
                        {/each}
                    </div>
                </Column>
            {/each}
        </Row>
    </Grid>
</Content>

<style>
	.mb-3 {
		margin-bottom:1em;
	}
    .column-content {
        height: 95%;
        overflow-y: scroll;
        padding-bottom: 1em;
    }
    .button-tile {
        display: flex;
    }
    .card {
        margin-bottom: 1em;
    }
    .day::-webkit-scrollbar {
       display: none;
    }
</style>