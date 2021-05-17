<script>
    import { Grid, Row, Column, ClickableTile, Button } from "carbon-components-svelte";
    import {dndzone} from "svelte-dnd-action";
    import {flip} from "svelte/animate";
    import moment from 'moment';

    let todo = {
        "20210517": [
            {id: 41, name: "item41"},
            {id: 42, name: "item42"},
            {id: 43, name: "item43"},
            {id: 50, name: "item41"},
            {id: 51, name: "item42"},
            {id: 52, name: "item43"},
            {id: 53, name: "item41"},
            {id: 54, name: "item42"},
            {id: 55, name: "item43"},
            {id: 56, name: "item41"},
            {id: 57, name: "item42"},
            {id: 58, name: "item43"},
            {id: 59, name: "item41"},
            {id: 60, name: "item42"},
            {id: 61, name: "item43"},
            {id: 62, name: "item41"},
            {id: 63, name: "item42"},
            {id: 64, name: "item43"},
            {id: 65, name: "item41"},
            {id: 66, name: "item42"},
            {id: 67, name: "item43"},
            {id: 68, name: "item41"},
            {id: 69, name: "item42"},
            {id: 70, name: "item43"},
            {id: 71, name: "item41"},
            {id: 72, name: "item42"},
            {id: 73, name: "item43"},
        ],
        "20210518": [
            {id: 44, name: "item44"},
        ],
        "20210519": [
            {id: 43, name: "item43"},
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

    function handleClick(e) {
        alert('dragabble elements are still clickable :)');
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
        <Column>
            <Button on:click={handleBackDate}>Back</Button>
        </Column>
        <Column>
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
                <div class="column-content" use:dndzone="{{items: todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [], flipDurationMs}}" on:consider="{(e) => handleDndConsiderCards(row,e)}" on:finalize="{(e) => handleDndFinalizeCards(row,e)}">
                    {#each todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] ? todo[moment().add(row, 'd').add(modifier, 'd').format('yyyyMMDD')] : [] as item(item.id)}
                        <div class="card" animate:flip="{{duration: flipDurationMs}}">
                            <ClickableTile>{item.name}</ClickableTile>
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
</style>