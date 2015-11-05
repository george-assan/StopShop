        
        
        var cartArrayForQuantity = [];
        var cartArrayForEnteredQuantities = [];
        var cartArrayForBarcode = [];
        var cartArrayForStock =[];
        var totalAmount = 0;
        var transactionId = 0;

         function sendRequest ( u )
           {
               var obj = $.ajax({url:u,async:false});
                var result=$.parseJSON(obj.responseText);
                return result;
           }//end of sendrequest


      
         function addProduct(){

            var name = encodeURI(document.getElementById("product_name").value);
            var price = encodeURI(document.getElementById("product_price").value);
            var quantity = encodeURI(document.getElementById("product_quantity").value);
            if(quantity == ""){
                quantity= 1;
            }
            var barcode = encodeURI(document.getElementById("product_barcode").value);
             var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=2&nme="+name+"&price="+price+"&qua="+quantity+"&barcode="+barcode;
               var obj = sendRequest ( url );

         }
               $(document).ready(function(){
   $(".button-collapse").sideNav();
});

        function addToCart(){
          
            var barcode = encodeURI(document .getElementById("barcodet").value);
            var quantity = encodeURI(document.getElementById("quantityt").value);
            cartArrayForBarcode.push(barcode);
            cartArrayForEnteredQuantities.push(quantity);
              var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=4&barcode="+barcode;
               var obj = sendRequest ( url );

                if ( obj.result === 1 )
                {
             
          var i = 0;
          var panels =" <tr><td>"+obj.productobj[i].productname+"</td><td>"+obj.productobj[i].unitprice+"</td><td>"+quantity+"</td>";
          var newQuantity = obj.productobj[i].quantity - quantity;
          cartArrayForQuantity.push(newQuantity);
          
           $ ( ".collection" ).append (panels);
           var amount = obj.productobj[i].unitprice * quantity;
           totalAmount = totalAmount + amount;
           $ ( ".totalLabel" ).html("<h2 style='font-family:arial'><center>Total: "+totalAmount+"</center></h2>");
         }
         else{
        
         
         }

        }

        function recordSales(){
          var boolVal = "false";
          var phoneNumber = encodeURI(document .getElementById("phonenum").value);
          if(totalAmount >= 500){
              boolVal = "true";
          }
           var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=5&phonenum="+phoneNumber+"&amount="+totalAmount+"&bool="+boolVal;
            var obj = sendRequest ( url );
            if(obj.result === 1){
            updateStock();
            resetTransactionInput();
            alert("Transaction successful");
            }
            else{
              alert("Transaction failed");      
            }
            //location.reload(); 

        }


        function updateStock(){
          var i = 0;
          for(;i<cartArrayForBarcode.length;i++){

          var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=6&barcode="+cartArrayForBarcode[i] +"&quantity="+cartArrayForQuantity[i];
            var obj = sendRequest ( url );
            fillpurchases(cartArrayForBarcode[i],cartArrayForEnteredQuantities[i]);
          }
        }

        function fillpurchases(barcode,quantity){

          var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=10";
            var obj = sendRequest ( url );
            transactionId = obj.tid[0].transactionid;

          var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=11&barcode="+barcode+"&quantity="+quantity+"&tid="+transactionId;
            var obj = sendRequest ( url );
        }

  


        function login(){
          var username = document .getElementById("username").value;
          var password = document .getElementById("password").value;
          if(username=="owner" && password=="owner"){
            window.open("inventory.html");

          }else if(username=="teller" && password=="teller"){
          window.open("tellerview.html");
          }
        }

        function updatePrice(){
          var barcode = encodeURI(document .getElementById("barcodemodal").value);
          var price = encodeURI(document .getElementById("newprice").value);
          var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=7&barcode="+barcode+"&price="+price;
            var obj = sendRequest ( url );
        }

        function loadSalesDetails(tid){
            var url = "http://cs.ashesi.edu.gh/~csashesi/class2016/george-assan/POS2/user_controller.php?cmd=12&tid="+tid;
            var obj = sendRequest ( url );

          if ( obj.result === 1 ){
             
          var i = 0;
          var panels ="";
          var summary = "<h7><p><b>Customer phone number: </b>"+obj.details[0].customernum+"</p><p><b>Date & time: </b>"+obj.details[0].datetime+"</p></h7>";
          for ( ; i < obj.details.length; i++ )
                    {
                      var cost = obj.details[i].unitprice * obj.details[i].pquantity;
          panels += "<li class='collection-item'><b>Name: </b>"+obj.details[i].productname+"<br><b>Quantity: </b>"+obj.details[i].pquantity+"<br><b>Cost:</b>"+cost+"</li>";
          }
           $ ( ".summary" ).html (summary);
           $ ( "#salesdetailsdisplay" ).html (panels);
            $ ( "#modalfooter" ).html ("<h5><center>Total: "+ obj.details[0].expenditure+"</center></h5>");
         }
         else{
          
         
         }
        }

        function resetTransactionInput(){
           var barcode = document.getElementById("barcodet");
            var quantity = document.getElementById("quantityt");
             var number = document.getElementById("phonenum");
            barcode.value = "";
            quantity.value = "";
            number.value="";
            $ ( ".collection" ).html ("");
            $ ( ".totalLabel" ).html("");
            cartArrayForQuantity = [];
            cartArrayForEnteredQuantities = [];
            cartArrayForBarcode = [];
            transactionId = 0;
            totalAmount =0;

        }
