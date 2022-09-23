export default function Toggle(props){
    return (
        <div className="flex items-center mt-6">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="toggle"
              id="Purple"
              onClick={props.onClick}
              className="checked:bg-purple-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-2  appearance-none cursor-pointer"
            />
            <label
              htmlFor="Purple"
              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          <span className="text-gray-400 font-medium ml-2">{props.children}</span>
        </div>

    )
}