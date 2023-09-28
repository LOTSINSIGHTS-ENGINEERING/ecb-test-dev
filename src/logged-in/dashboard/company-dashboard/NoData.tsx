interface INoDataProps {
    message: string;
    children?: React.ReactNode;
}
export const NoData = (props: INoDataProps) => {
    return (
        <div className="uk-margin-top uk-text-center">
            <div className="uk-card uk-card-body">
                <p className="uk-text-center">
                    {props.message}
                    {props.children && <br />}
                    {props.children && <br />}
                    {props.children}
                </p>
            </div>
        </div>
    );
};