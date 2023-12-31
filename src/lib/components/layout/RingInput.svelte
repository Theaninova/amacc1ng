<script lang="ts">
  import {changes, highlightActions, layout} from "$lib/serial/connection"
  import type {Change} from "$lib/serial/connection"
  import type {CharaLayout} from "$lib/serialization/layout"
  import {KEYMAP_CODES} from "$lib/serial/keymap-codes"
  import type {KeyInfo} from "$lib/serial/keymap-codes"
  import {editableLayout} from "$lib/editable-layout"

  export let activeLayer = 0
  export let keys: Record<"d" | "s" | "n" | "w" | "e", number>

  const virtualLayerMap = [1, 0, 2]
  const characterOffset = 8

  function offsetDistance(quadrant: number, layer: number, activeLayer: number): number {
    const layerOffsetIndex = virtualLayerMap[layer] - virtualLayerMap[activeLayer]
    const layerOffset = quadrant > 2 ? -characterOffset : characterOffset
    return 25 * quadrant + layerOffsetIndex * layerOffset
  }

  function getActions(id: number, layout: CharaLayout, changes: Change[]): [KeyInfo, KeyInfo | undefined][] {
    return Array.from({length: 3}).map((_, i) => {
      const actionId = layout?.[i][id]
      const changedId = changes.findLast(it => it?.layout?.[i]?.[id] !== undefined)?.layout![i]![id]
      if (changedId !== undefined) {
        return [KEYMAP_CODES[changedId], KEYMAP_CODES[actionId]]
      } else {
        return [KEYMAP_CODES[actionId], undefined]
      }
    })
  }
</script>

<div class="radial">
  {#each [keys.n, keys.e, keys.s, keys.w, keys.d] as id, quadrant}
    {@const actions = getActions(id, $layout, $changes)}
    <button
      use:editableLayout={{activeLayer, id}}
      class:active={actions.some(([it]) => it && $highlightActions?.includes(it.code))}
    >
      {#each actions as [keyInfo, old], layer}
        {#if keyInfo}
          <span
            class:active={virtualLayerMap[activeLayer] === virtualLayerMap[layer]}
            class:icon={!!keyInfo.icon}
            class:changed={!!old}
            style="offset-distance: {offsetDistance(quadrant, layer, activeLayer)}%"
            >{keyInfo.icon || keyInfo.id || keyInfo.code}</span
          >
        {/if}
      {/each}
    </button>
  {/each}
</div>

<style lang="scss">
  @use "sass:math";

  $border-width: 18px;
  $gap: 6px;
  $size: 96;
  $offset: 14;
  $scale-difference: 0.2;
  $transition-time: 750ms;

  .radial {
    position: relative;

    container: radial / size;

    width: #{$size * 1px};
    height: #{$size * 1px};

    transition: all 250ms ease;
  }

  span {
    $cr: math.div($size, 2) - 2 * $offset;

    will-change: scale, offset-distance;
    user-select: none;

    scale: 0.9;
    offset-path: path(
      "M#{math.div($size, 2)} #{$offset}A#{$cr} #{$cr} 0 1 1 #{math.div($size, 2)} #{$size - $offset}A#{$cr} #{$cr} 0 1 1 #{math.div($size, 2)} #{$offset}Z"
    );
    offset-rotate: 0deg;

    display: flex;
    grid-column: 1;
    grid-row: 1;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    font-size: 16px;

    opacity: 0.2;

    transition:
      scale $transition-time ease,
      opacity $transition-time ease,
      offset-distance $transition-time ease;

    &.active {
      scale: 1;
      opacity: 1;
    }

    &.icon {
      font-size: 20px;
      font-weight: 800;
    }

    &.changed {
      color: var(--md-sys-color-on-secondary-container);
      background: var(--md-sys-color-secondary-container);
    }
  }

  button {
    all: unset;

    cursor: pointer;

    position: absolute;

    display: grid;

    width: 100cqw;
    height: 100cqh;
    padding: 0;

    font-family: inherit;
    font-size: 16px;
    font-weight: 900;
    color: var(--md-sys-color-on-surface-variant);

    background: var(--md-sys-color-surface-variant);
    border: none;

    transition: all 250ms ease;

    mask-image: url("$lib/assets/quater-ring.svg");
    mask-size: 100% 100%;

    &.active,
    &:active {
      color: var(--md-sys-color-on-tertiary);
      background: var(--md-sys-color-tertiary);
    }

    &:nth-child(1) {
      clip-path: polygon(50% 50%, 0 0, 100% 0);
    }

    &:nth-child(2) {
      clip-path: polygon(50% 50%, 100% 0, 100% 100%);
    }

    &:nth-child(3) {
      clip-path: polygon(50% 50%, 0 100%, 100% 100%);
    }

    &:nth-child(4) {
      clip-path: polygon(50% 50%, 0 0, 0 100%);
    }

    &:last-child {
      top: 50%;
      left: 50%;
      translate: -50% -50%;

      overflow: hidden;

      width: 25cqw;
      height: 25cqh;

      border-radius: 50%;

      mask-image: none;
    }
  }
</style>
