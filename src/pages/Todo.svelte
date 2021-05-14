<script>
    import { Grid, Row, Column, ClickableTile } from "carbon-components-svelte";
    import {dndzone} from "svelte-dnd-action";
    import {flip} from "svelte/animate";
    import moment from 'moment';

    let todo = {
        "20210521": [
            {id: 41, name: "item41"},
            {id: 42, name: "item42"},
            {id: 43, name: "item43"},
            {id: 44, name: "item44"},
            {id: 45, name: "item45"},
            {id: 46, name: "item46"},
            {id: 47, name: "item47"},
            {id: 48, name: "item48"},
            {id: 49, name: "item49"}
        ],
        "20210522": [],
        "20210523": [],
    }

    let modifier = 0
    let items = []

    const flipDurationMs = 200;

    function handleDndConsiderCards(cid, e) {
        const colIdx = columnItems.findIndex(c => c.id === cid);
        columnItems[colIdx].items = e.detail.items;
        columnItems = [...columnItems];
    }

    function handleDndFinalizeCards(cid, e) {
        const colIdx = columnItems.findIndex(c => c.id === cid);
        columnItems[colIdx].items = e.detail.items;
        columnItems = [...columnItems];
    }

    function handleClick(e) {
        alert('dragabble elements are still clickable :)');
    }
</script>

<Grid>
    <Row>
        <Column>
            <div class="mb-3">
                <h3>
                    {moment().add(modifier, 'd').format('dddd')}
                </h3>
            </div>
            <div use:dndzone="{{items, flipDurationMs}}" on:consider="{handleDndConsiderCards}" on:finalize="{handleDndFinalizeCards}">
                {#each items as item(item.id)}
                    <div animate:flip="{{duration: flipDurationMs}}">
                        <ClickableTile>{item.name}</ClickableTile>
                    </div>
                {/each}
            </div>
        </Column>

        <Column>
            <div class="mb-3">
                <h3>
                    {moment().add(1, 'd').add(modifier, 'd').format('dddd')}
                </h3>
            </div>
            <div use:dndzone="{{items, flipDurationMs}}" on:consider="{handleDndConsiderCards}" on:finalize="{handleDndFinalizeCards}">
                {#each items as item(item.id)}
                    <div animate:flip="{{duration: flipDurationMs}}">
                        <ClickableTile>{item.name}</ClickableTile>
                    </div>
                {/each}
            </div>
        </Column>

        <Column>
            <div class="mb-3">
                <h3>
                    {moment().add(2, 'd').add(modifier, 'd').format('dddd')}
                </h3>
            </div>
        
            <ClickableTile>Monday</ClickableTile>
        </Column>

        <Column>
            <div class="mb-3">
                <h3>
                    {moment().add(3, 'd').add(modifier, 'd').format('dddd')}
                </h3>
            </div>
            <ClickableTile>Monday</ClickableTile>
        </Column>

        <Column>
            <div class="mb-3">
                <h3>
                    {moment().add(4, 'd').add(modifier, 'd').format('dddd')}
                </h3>
            </div>
            <ClickableTile>Monday</ClickableTile>
        </Column>
    </Row>
</Grid>

<style>
	.mb-3 {
		margin-bottom:1em;
	}
</style>