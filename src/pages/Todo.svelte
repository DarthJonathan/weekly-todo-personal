<script>
    import { Grid, Row, Column, ClickableTile, Button } from "carbon-components-svelte";
    import {dndzone} from "svelte-dnd-action";
    import {flip} from "svelte/animate";
    import moment from 'moment';
    import { onMount } from 'svelte';
    import supabase from '../util/supabase-util';
    import { userStore } from "../store/user";

    let todo = {}

    onMount(async () => {
        let { data: todoList, error } = await supabase
            .from('todo')
            .select('*')
            .gt('date', moment().add(-30, 'd').format('yyyyMMDD'))
            .eq('user_id', $userStore.id)

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
    }

    function handleDndFinalizeCards(date, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        todo[key] = e.detail.items;
    }

    function handleClick(date, item) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        let todoId = document.getElementById(key + item.id);

        if(todoId.getAttribute('contenteditable') == 'true') {
            return;
        }

        const idx = todo[key].findIndex(c => c.id === item.id);
        todo[key][idx].done = !todo[key][idx].done;
    }

    function handleEdit(date, item, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        let todoId = document.getElementById(key + item.id);

        if(todoId.getAttribute('contenteditable') == 'true') {
            const idx = todo[key].findIndex(c => c.id === item.id);
            todo[key][idx].action = todoId.textContent;

            todoId.setAttribute('contenteditable', 'false');
        }else {
            todoId.setAttribute('contenteditable', 'true');
        }
    }

    function onKeyPress(date, item, e) {
        if (e.charCode == 13) {
            let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
            let todoId = document.getElementById(key + item.id);
            const idx = todo[key].findIndex(c => c.id === item.id);
            todo[key][idx].action = todoId.textContent;
            todoId.setAttribute('contenteditable', 'false');
        }
    }

    function handleDelete(date, item, e) {
        let key = moment().add(date, 'd').add(modifier, 'd').format('yyyyMMDD')
        const result = todo[key].filter(c => c.id !== item.id);
        todo[key] = result;
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
                { action: '', user_id: $userStore.id, date: moment().add(row, 'd').add(modifier, 'd') },
            ])

            for(let i = 0; i < todo[key].length; i++) {
                if (todo[key][i].id === 'placeholder-id') {
                    todo[key][i].id = data[0].id
                }
            }

            console.log(data);
        }
    }
    </script>

<Grid style="padding-top:1em; min-height: 100vh;">
    <Row>
        <Column style="text-align:left;">
            <Button on:click={handleBackDate}>Back</Button>
        </Column>
        <Column style="text-align:center;">
            <h2>DOThese</h2>
        </Column>
        <Column style="text-align:right;">
            <Button on:click={handleFrontDate}>Forward</Button>
        </Column>
    </Row>
    <br />
    <Row style="height: 90vh;">
        {#each Array(5) as _, row}
            <Column style="overflow-y: hidden; height: 90vh; padding-bottom: 1em;">
                <div class="mb-3">
                    <h3>
                        {moment().add(row, 'd').add(modifier, 'd').format('dddd')}
                    </h3>
                </div>
                <div class="column-content" on:click={(e) => handleNew(row, e)} use:dndzone="{{items: todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [], flipDurationMs, dropTargetStyle: {outline: 'rgba(125, 125, 125, 0.3) solid 1.5px'}}}" on:consider="{(e) => handleDndConsiderCards(row,e)}" on:finalize="{(e) => handleDndFinalizeCards(row,e)}">
                    {#each todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [] as item(item.id)}
                        <div class="card" animate:flip="{{duration: flipDurationMs}}" on:keypress={(e) => onKeyPress(row, item, e)}>
                            {#if item.done}
                                <ClickableTile 
                                    id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                    disabled 
                                    on:click={handleClick(row, item)}
                                >{item.action}</ClickableTile>
                            {:else}
                                <ClickableTile 
                                    id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                    on:click={handleClick(row, item)}
                                >{item.action}</ClickableTile>
                            {/if}
                            <div class="button-tile">
                                <Button style="width: 50%;" on:click={(e) => handleEdit(row, item, e)}>E</Button>
                                <Button style="width: 50%;" on:click={(e) => handleDelete(row, item, e)}>D</Button>
                            </div>
                        </div>
                    {/each}
                </div>
            </Column>
        {/each}
    </Row>
</Grid>

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
</style>