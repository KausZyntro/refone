import Image from "next/image"

const Loading = () => {
  return <div style={{ width: 200, height: 200, margin: "auto" }}>
      <Image
        src="/loading.svg" // path relative to public folder
        alt="Loading animation"
        width={200}
        height={200}
      />
    </div>
}

export default Loading
