
const buttonClickHandle = (value, actionProvider) => {
    actionProvider.handleMessage(value)
}

const Chips = (props) => {

  const {actionProvider} = props 
  const {options} = props.widgetConfig

  return (
    <div className="ml-5">
        { options.map( opt => 
            <button 
                className="btn btn-sm btn-primary rounded px-2 m-1" key={opt.text}
                onClick={() => buttonClickHandle(opt.text, actionProvider)}
            >
                { opt.text }
            </button> 
        ) }
    </div>
  );
};

export default Chips;