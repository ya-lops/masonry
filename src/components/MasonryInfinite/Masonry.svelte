<script>
  import InfiniteScroll from "@/components/shared/InfiniteScroll.svelte";

  let page = 0;
  let size = 12;
  let images = [];
  let imagesArray;
  let m = { x: 0, y: 0 };
  let rowHeight = 50;


  const getImages = import.meta.glob("@/images/*", { eager: true });
  imagesArray = Object.values(getImages).map((image) => image.default);

  let totalHeight = 0;

  for (const image of imagesArray) {
    totalHeight += image.height/imagesArray.length;
  }

  let avarageSpan = totalHeight/rowHeight;

  console.log(avarageSpan);

  // updating render array
  $: images = [...images, ...imagesArray.slice(size * page, size * (page + 1))];

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

<section class="masonry">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  {#each images as image, index}
    <div
      class={"masonry__item " + (index > size ? "loaded" : "")}
      style={"grid-row-end: span " + Math.min(Math.round(image.height / rowHeight), 28)}
      on:mousemove={onMouseMoveViewImg}
    >
      <img
        width={image.width}
        height={image.height}
        src={image.src}
        alt={`Image ${index + 1}`}
        {...index <= size/3
          ? { loading: "eager", decoding: "auto" }
          : { loading: "lazy", decoding: "async" }}
      />
    </div>
  {/each}
  <InfiniteScroll
    window
    hasMore={images.length < imagesArray.length}
    threshold={100}
    on:loadMore={() => page++}
  />
</section>

<style lang="scss">
  .masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    // grid-auto-rows: 25px;
    gap: 0.5rem;
    margin-block: 1rem;
    

    &__item {
      flex: 1;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.125) 1px 3px 3px;

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
