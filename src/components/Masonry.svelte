<script>
  import { onMount, onDestroy } from "svelte";

  const getImages = import.meta.glob("@/images/*", { eager: true });

  let images = [];
  let imageColumns = [];
  let windowWidth;
  let columns = 3;

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
</script>

<section class="masonry" style="--columns: {columns};">
  {#each imageColumns as chunk}
    <div class="masonry__column">
      {#each chunk as image, index}
        <div class="masonry__item">
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

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
      }
    }
  }
</style>
