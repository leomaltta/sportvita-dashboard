interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="mx-auto w-full max-w-[40rem] md:max-w-screen-2xl lg:max-w-[90rem]">
      {children}
    </div>
  )
}

export default Container
