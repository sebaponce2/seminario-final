const ActionBar = ({ selected, onSubmit }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <button
        onClick={onSubmit}
        className={`bg-black text-white px-4 py-2 rounded-md ${
          selected
            ? "opacity-100 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!selected}
      >
        Solicitar Trueque
      </button>
      <p className="text-black">
        {selected ? "Publicación seleccionada" : "Seleccione una publicación"}
      </p>
    </div>
  );
};

export default ActionBar;
