window.addEventListener("load", function () {
  console.log("holas");
  console.log("en acordeon");

  // Accordion
  // Obtén todos los enlaces de categoría
  var categoryLinks = document.querySelectorAll(
    ".templatemo-accordion > li > a"
  );

  // Agrega un evento clic a cada enlace de categoría
  categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Encuentra la lista desordenada anidada relacionada
      var sublist = this.nextElementSibling;

      // Toggle (alternar) la visibilidad de la lista desordenada anidada
      if (sublist.style.display === "none" || sublist.style.display === "") {
        sublist.style.display = "block";
        sublist.classList.add("active"); // Agregar la clase 'active'
        this.querySelector("i").classList.remove("fa-chevron-circle-down");
        this.querySelector("i").classList.add("fa-chevron-circle-up");
      } else {
        sublist.style.display = "none";
        sublist.classList.remove("active"); // Quitar la clase 'active'
        this.querySelector("i").classList.remove("fa-chevron-circle-up");
        this.querySelector("i").classList.add("fa-chevron-circle-down");
      }
    });
  });
  // End accordion

  // Product detail
  var productLinks = document.querySelectorAll(".product-links-wap a");
  var productDetail = document.getElementById("product-detail");
  productLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var imgSrc = link.querySelector("img").getAttribute("src");
      productDetail.setAttribute("src", imgSrc);
    });
  });

  var btnMinus = document.getElementById("btn-minus");
  var btnPlus = document.getElementById("btn-plus");
  var varValue = document.getElementById("var-value");
  var productQuantity = document.getElementById("product-quanity");

  btnMinus.addEventListener("click", function (event) {
    event.preventDefault();
    var val = parseInt(varValue.innerHTML);
    val = val === 1 ? val : val - 1;
    varValue.innerHTML = val;
    productQuantity.value = val;
  });

  btnPlus.addEventListener("click", function (event) {
    event.preventDefault();
    var val = parseInt(varValue.innerHTML);
    val++;
    varValue.innerHTML = val;
    productQuantity.value = val;
  });

  var btnSizes = document.querySelectorAll(".btn-size");
  var productSize = document.getElementById("product-size");

  btnSizes.forEach(function (btnSize) {
    btnSize.addEventListener("click", function (event) {
      event.preventDefault();
      var thisVal = btnSize.innerHTML;
      productSize.value = thisVal;
      btnSizes.forEach(function (btn) {
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-success");
      });
      btnSize.classList.remove("btn-success");
      btnSize.classList.add("btn-secondary");
    });
  });
  // End product detail
  const checkbox = document.getElementById("checkbox");
  const label = document.querySelector("label[htmlFor='checkbox']");

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      label.classList.add("checked");
    } else {
      label.classList.remove("checked");
    }
  });
});

