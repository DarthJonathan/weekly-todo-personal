<script>
    import { Grid, Row, Column, ClickableTile, Button } from "carbon-components-svelte";
    import {dndzone} from "svelte-dnd-action";
    import {flip} from "svelte/animate";
    import moment from 'moment';

    let todo = {
        "20210517": [
            {id: 41, name: "item41", done: true},
            {id: 42, name: "item42", done: false},
            {id: 43, name: "item43", done: false},
            {id: 50, name: "item41", done: false},
            {id: 51, name: "item42", done: false},
            {id: 52, name: "item43", done: false},
            {id: 53, name: "item41", done: false},
            {id: 54, name: "item42", done: false},
            {id: 55, name: "item43", done: false},
            {id: 56, name: "item41", done: false},
            {id: 57, name: "item42", done: false},
            {id: 58, name: "item43", done: false},
            {id: 59, name: "item41", done: false},
            {id: 60, name: "item42", done: false},
            {id: 61, name: "item43", done: false},
            {id: 62, name: "item41", done: false},
            {id: 63, name: "item42", done: false},
            {id: 64, name: "item43", done: false},
            {id: 65, name: "item41", done: false},
            {id: 66, name: "item42", done: false},
            {id: 67, name: "item43", done: false},
            {id: 68, name: "item41", done: false},
            {id: 69, name: "item42", done: false},
            {id: 70, name: "item43", done: false},
            {id: 71, name: "item41", done: false},
            {id: 72, name: "item42", done: false},
            {id: 73, name: "item43", done: false},
        ],
        "20210518": [
            {id: 44, name: "item44", done: false},
        ],
        "20210519": [
            {id: 43, name: "item43", done: false},
        ],
    }

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
            todo[key][idx].name = todoId.textContent;

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
            todo[key][idx].name = todoId.textContent;
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
                <div class="column-content" use:dndzone="{{items: todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [], flipDurationMs, dropTargetStyle: {outline: 'rgba(125, 125, 125, 0.3) solid 1.5px'}}}" on:consider="{(e) => handleDndConsiderCards(row,e)}" on:finalize="{(e) => handleDndFinalizeCards(row,e)}">
                    {#each todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [] as item(item.id)}
                        <div class="card" animate:flip="{{duration: flipDurationMs}}" on:keypress={(e) => onKeyPress(row, item, e)}>
                            {#if item.done}
                                <ClickableTile 
                                    id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                    disabled 
                                    on:click={handleClick(row, item)}
                                >{item.name}</ClickableTile>
                            {:else}
                                <ClickableTile 
                                    id={moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')+item.id} 
                                    on:click={handleClick(row, item)}
                                >{item.name}</ClickableTile>
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
</style>