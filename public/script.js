$(document).ready(function () {
  $("#form-login").submit(function (ev) {
    ev.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if(!email || !password){
      toastAlert("Debes ingresar ambos valores");
    }else{
      //console.log(email, password);
      logUsuario(email, password);
    }

    

  });
});
const logUsuario = async (email, password) => {
  try {
    const response = await axios.get(
      `http://localhost:3002/SignIn?email=${email}&password=${password}`
    );
    //console.log(response.data);

    if (response.data.succes) {
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("token", response.data.token);
      //console.log(localStorage.getItem("token"));
      window.location.href = "/SignIn/aut";
    } 
  } catch (error) {
    toastAlert(`${error.response.data.message}`);
  }
};
$(document).ready(function() {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  //console.log(token);

  $("#p-email").text(email);
  $("#p-token").text(token);
  $('#btn-acceso').click(async function() {
    try {
      const response = await axios.get(`http://localhost:3002/restricted?token=${token}`);
      
      if (response.data.success) {
        window.location.href = "/SignIn/aut/restringido";
      }
    } catch (error) {
      toastAlert(`${error.response.data.error}, ${error.response.data.message} `);
      console.error("Error en la solicitud:", error.message);
    }
  });
});


//TOAST
function toastAlert(message) {
  $("#toastContainer").empty();
  const toast = `<div class="toast" role="toastalert" aria-live="assertive" aria-atomic="true" data-delay="5000">
    <div class="toast-header">
      <strong class="me-auto">ToastAlert</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>  </div>
    <div class="toast-body">
      ${message}
    </div>
    </div>`;
  $("#toastContainer").append(toast);
  $(".toast").toast("show");
  $("#exampleModal").modal("hide");
}