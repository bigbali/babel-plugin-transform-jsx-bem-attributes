const ClassName = () => {
    return (
        <>
            <div className="ClassName" />
            <div className={"ClassName"} />
            <div className={["ClassName0", "ClassName1", "ClassName2"]} />
            <div className="" />
            <div className={""} />
            <div className={["", "", ""]} />
        </>
    );
}