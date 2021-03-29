function fetchData(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(new Error("The network is not OK"));
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

 function data() {
    const products_div = document.querySelector("#products"); 

    fetchData("http://webacademy.se/fakestore/")
    .then((products) => {
      for (let product of products) {
      console.log(product);// alla product objekt


      products_div.innerHTML += `
    <div class="card card-body col-md-4" style="margin: 5px;">
        <img id="itemImg" class="img-thumbnail itemImg" style="width: 250px; height: 250px; margin:0 auto;"
        src="${product.image}" alt=${product.title} >
        </img>
        <div class="card-body">
        <h2 id="itemName" class="card-title text-center text-capitalize itemName">
        ${product.title}
        </h2>
        <p　class="card-text">${product.description}
        </p>
        </div>
        <strong id="itemPrice" class="itemPrice">${product.price.toFixed(1)} SEK</strong><br>
        <button id=addToCart class="w-100 btn btn-outline-success addToCart">Add to Your cart</button>
    </div>`
    
      }

    })
    .then(() => buttons());
    
 }
 data();
    
 
 window.onload = () => {
  let itemList = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

    console.log(itemList);
  printItemsToCart(itemList);
};


//Skapa alla buttan till varje produkt  
function buttons() {
  //Lägga varor i varukorg
    const addToCartBtn = document.querySelectorAll(".addToCart");
    addToCartBtn.forEach((e) => {
      e.addEventListener("click", addToCart);
    });
    
  //ökning
    const increBtn = document.querySelectorAll(".cartIncrement");
    increBtn.forEach((e) => {
      e.addEventListener("click", changeQuantity);
    });
  //minskning
    const decreBtn = document.querySelectorAll(".cartDecrement");
    decreBtn.forEach((e) => {
      e.addEventListener("click", changeQuantity);
    });
  //ta bort varor från korgen
    const deleteBtn = document.querySelectorAll(".itemDelete");
    deleteBtn.forEach((e) => {
      e.addEventListener("click", deleteItem);
    });
  }
  

  function addToCart(e) {
    const item = e.target.parentElement;
    //Spara valda produkt data som uppfyller JSON-krav i objekt
    const selectedItem = {
      title: item.getElementsByClassName("itemName")[0].innerHTML,
      image: item.getElementsByClassName("itemImg")[0].src,
      price: item.getElementsByClassName("itemPrice")[0].innerHTML,
      qty: 1,
    };

    //när varukorgs produkter uppdateras kommer att sparas i array(itemList)

    //Ange nyckeln(items) till det värde som man vill få
    //Konvertera en sträng skriven i JSON-format till ett JavaScript JSON-objekt
    //för att hantera JSON data i JavaScript  
    let itemList = JSON.parse(localStorage.getItem("items"));// getItem(key)
    !itemList ? (itemList = []) : null; //om det finns inte itemList skapa array
    
    // Kolla det finns valda produkt i varukorg eller inte
    for (let product of itemList) {
      if (product.title === selectedItem.title) {
        alert("The item is alreday in your shopping cart");
        return;
      }
    }

    // Spara i form av nyckel(items) och värde(Konvertera till serieiserad formell JSON-data) till localstrage
    localStorage.setItem("items", JSON.stringify([...itemList, selectedItem])); //[array(itemList),obj(selectedItem) ]
    itemList = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))//Konvertera en sträng skriven i JSON-format till ett JavaScript JSON-objekt
      : [];
    console.log(itemList);//array av objekt
    console.log( JSON.stringify([...itemList, selectedItem]) );//json data
    console.log(localStorage);

    //Till funktion printItemsToCart-> printa ut valda produkter
    printItemsToCart(itemList);
  }
  
  
  function changeQuantity(e) {
    let input = e.target.parentNode.querySelector(".cartQuantInput");
  
    if (e.target.classList.contains("cartIncrement")){
      input.value = parseInt(input.value) + 1;// String -> Int
    } else if (
      e.target.classList.contains("cartDecrement") &&
      !(input.value <= 1)
    ) {
      input.value = parseInt(input.value) - 1;
    }
  
    // Ändra kvantitet (input) 
    const cartQtyNum = e.target.parentNode.querySelector(".itemQuantity");
    cartQtyNum.innerHTML = input.value;
  }
  

  function deleteItem(e) {
    const deleteItem = e.target.parentElement.parentElement;
  
    const selectedItem = {
      title: deleteItem.getElementsByClassName("cartItemName")[0].innerHTML,
      image: deleteItem.getElementsByClassName("cartItemImg")[0].src,
      price: deleteItem.getElementsByClassName("cartItemPrice")[0].innerHTML,
    };
    // itemList som valda produkter sparas i
    let itemList = JSON.parse(localStorage.getItem("items"));// getItem(key)
    // newList som valda produkter sparas i utom selectedItem(som tas bort ) 
   
    const newItemList = itemList.filter(
      (item) => JSON.stringify(item.title) !== JSON.stringify(selectedItem.title)
    );
   console.log(newItemList);
   console.log(localStorage);

    // Ta bort produkter från localstrage
    localStorage.clear();
    localStorage.setItem("items", JSON.stringify(newItemList));　//setItem(key, value)
    printItemsToCart(newItemList);
  }
  
  function printItemsToCart(itemList) {
    const cartItemsDiv = document.querySelector(".list");
    cartItemsDiv.innerHTML = "";
  
    itemList.forEach((item) => {
      cartItemsDiv.innerHTML += 
      `<li class="d-flex align-items-center justify-content-around py-1">
      <img
      src="${item.image}"
      class="img-thumbnail cartItemImg" style="width: 50px; height: 50px "
      alt="${item.title}"
          /> 
      <span class="item-title cartItemName">${item.title}</span>

      <div class="d-flex">
      <button class="cart-de-in-button cartDecrement">-</button>

      <div class="cart-quantity-container position-relative">
          <input type="number" value="${item.qty}" class="cart-quantity-input cartQuantInput" />
          <div id="itemQuantity" class="cart-quantity-num itemQuantity">${item.qty}</div>
      </div>

      <button class="cart-de-in-button  cartIncrement">+</button>
      </div>
      
      </div>
      <span id="cartItemPrice" class ="cartItemPrice"> ${item.price}</span>

      <div>
      <button id="itemDelete" class="btn my-auto itemDelete">
      X
      </button>
      </div>

      </li>`
  
      buttons();
      

    });
  }


  //-------------------------------------------------------------

   
  // Dra ner och dra up varukorgen
    $(document).ready(function () {


                $("#cartBtn").click(function(){
                $("#cart").slideDown("100");
                });
                $("#closeBtn").click(function(){
                $("#cart").slideUp("100");
                });


 //Add user info fel hantering
        $(function(){
	    $('button:submit[id="order"]').click(function(){
		if(!formInputCheck()){
			return false;
            }
            });
        });
        

        function formInputCheck(){
            var result=true;

            //Error meddelande återställa
            $("#name_error").empty();
            $("#tel_error").empty();
            $("#email_error").empty();
            $("#address_error").empty();

            //Ställ in inmatade innehållet
            let name =$("#name").val();
            let tel=$("#tel").val().replace(/[━.*‐.*―.*－.*\–.*ー.*\-]/gi,'');
            let email=$("#email").val();
            let address=$("#address").val();

            //Kolla på inmatade innehållet

            //Name:
            if(name == ""){
                $("#name_error").html("Please input your name (Destination)");
                result = false;
            }else if(name.length > 25){
                $("#name_error").html("Please input your name within 25 characters");
                result = false;
            }

            //phone:
            if(tel == ""){
                $("#tel_error").html("Please input your phone number");
            result = false;
            }else if((!tel.match(/^[0-9]+$/)) || (tel.length < 10)){
                $('#tel_error').html("Please input correct phone number");
                result = false;
            }

            //Email:
            if(email == ""){
                $("#email_error").html("Please input your e-mail");

                result = false;
            }else if(!email.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)){
                $('#email_error').html("Please input correct e-mail");
                result = false;
            }else if(email.length > 255){
                $('#email_error').html("Please input correct e-mail");
                result = false;
            }

            //Address:
            if(address == ""){
                $("#address_error").html("Please input your address (Shipping address)");
                result = false;
            }else if(address.length > 50){
                $("#address_error").html("Please input your address (Shipping address) within 50 characters");
                result = false;
            }
            return result;

        }
    
        
        });
