<script>
  import { onMount, onDestroy } from "svelte";

  const getImages = import.meta.glob("@/images/*", { eager: true });

  let images = [];
  let imageColumns = [];
  let windowWidth;
  let columns = 3;

  let m = { x: 0, y: 0 };

  onMount(async () => {
    window.addEventListener("resize", updateColumns);
    updateColumns();

    images = Object.values(getImages).map((image) => image.default);
    imageColumns = chunkArray(images, columns);
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateColumns);
  });

  function updateColumns() {
    windowWidth = window.innerWidth;

    if (windowWidth > 1000) {
      columns = 4;
    } else if (windowWidth > 768) {
      columns = 3;
    } else {
      columns = 2;
    }

    imageColumns = chunkArray(images, columns);
  }

  function chunkArray(array, columns) {
    const chunks = Array.from({ length: columns }, () => []);

    array.forEach((item, index) => {
      chunks[index % columns].push(item);
    });

    return chunks;
  }

  function onMouseMoveViewImg(event) {
    m = {
      x:
        50 -
        Math.round((event.offsetX / event.currentTarget.clientWidth) * 100),
      y:
        50 -
        Math.round((event.offsetY / event.currentTarget.clientHeight) * 100),
    };

    event.target.style.cssText = `--x: ${m.x}%; --y: ${m.y}%;`;
  }
</script>

<section class="masonry" style="--columns: {columns};">
  {#each imageColumns as chunk}
    <div class="masonry__column">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      {#each chunk as image, index}
        <div class="masonry__item _item" on:mousemove={onMouseMoveViewImg}>
          <img
            width={image.width}
            height={image.height}
            src={image.src}
            alt={`Image ${index + 1}`}
            {...index <= 2
              ? { loading: "eager", decoding: "auto" }
              : { loading: "lazy", decoding: "async" }}
          />
        </div>
      {/each}
    </div>
  {/each}
</section>

<style lang="scss">
  .masonry {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0.5rem;
    margin-block: 1rem;

    &__column {
      display: flex;
      flex-flow: column;
      gap: 0.5rem;
    }

    &__item {
      flex: 1;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.125) 1px 3px 3px;
      animation-timeline: view();
      animation-name: showing;
      animation-fill-mode: both;
      animation-range-end: cover 20%;
      transform-origin: bottom center;
      margin-inline: auto;

      @keyframes showing {
        from {
          opacity: 0;
          translate: 0 50%;
        }

        to {
          opacity: 1;
          translate: 0 0;
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 50%;
        border-radius: 5px;
        transition: object-position 2s linear;
        transition-delay: 0.25s;
      }

      &:hover img {
        object-position: calc(50% - var(--x)) calc(50% - var(--y));
        transition: object-position 0s linear;
      }
    }
  }
</style>
