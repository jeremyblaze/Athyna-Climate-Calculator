
    if ( !$jq ) {
        var $jq = jQuery.noConflict();
    }
    
    function initDelete() {
        
        // run this after appending new members to list so that the delete button works
    
        $jq('.deleteMember').click(function(){
            
            $jq(this).parents('.member').remove();
            
            if ( !$jq('.memberList .member').length ) {
                $jq('.resultContent .empty').show();
                $jq('.resultContent .filled').hide();
            }
            
        });
        
    }
    
    function calcResult() {
        
        // calculate

            var pricePerCarbonUnit = 15;
            
            var userInputData = [];
            
            var totalEmissions = 0;
            var totalPrice = 0;
            
            $jq('.memberList .member').each(function(){
                var country = $jq(this).attr('data-country-id');
                var people = $jq(this).attr('data-people');
                var emissions = climateSrcData[country][0]['emm'] * people;
                
                totalEmissions = totalEmissions + emissions;
                totalPrice = totalPrice + (pricePerCarbonUnit * emissions);
                
                userInputData.push({
                    'country': country,
                    'people': people,
                    'emissionsCalculated': emissions
                });
            });
            
            userInputData.push({
                'totalEmissions': totalEmissions,
                'totalPrice': totalPrice
            });
        
        // display
        
            $jq('.climTonnes').html(totalEmissions);
            $jq('.climPrice').html(totalPrice.toFixed(2));
        
            $jq('.resultContent .empty').hide();
            $jq('.resultContent .filled').show();
            
        // send to field for submission
        
            $jq('input[name="climatedata"]').val(JSON.stringify(userInputData));
            
    }

    $jq(document).ready(function(){
        
        $jq.each(climateSrcData, function(index, value){
            $jq('.climCountry').append('<option value="'+value[0]['id']+'" data-html="'+value[0]['name']+'">'+value[0]['name']+'</option>');
        });
        $jq('.climCountry').dropzie();
        
        $jq('.addMember').click(function(){
            $jq('.addPopup').toggleClass('open');
        });
        
        $jq(document).click(function(e){
            if ( !$jq(e.target).parents('.addWrap').length ) {
                $jq('.addPopup').removeClass('open');
            }
        });
        
        $jq('.resultConfirm').click(function(){
            $jq('.resultContent .empty').hide();
            $jq('.resultContent .filled').hide();
            $jq('.resultContent .lead').show();
        });
        
        function isEmail(email) {
          var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          return regex.test(email);
        }
        
        $jq('.emailField').keypress(function(){
            if ( isEmail($jq(this).val()) ) {
                $jq('.emailConfirm').removeClass('disabled');
                $jq('input[name="climateemail"]').val($jq(this).val());
            } else {
                $jq('.emailConfirm').addClass('disabled');
            }
        });
        
        $jq('.emailBack').click(function(){
            $jq('.resultContent .lead').hide();
            $jq('.resultContent .filled').show();
        });
        
        $jq('.emailConfirm').click(function(){
            $jq('.resultContent .lead').hide();
            $jq('.resultContent .done').show();
            $jq('#climatedataform').submit();
        });
        
        // add country/people
        
            // auto validate
            setInterval(function(){
        
                if ( $jq('.climCountry').val() && $jq('.climCountry').val() != 'Select...' ) {
                    var countrySet = true;
                } else {
                    var countrySet = false;
                }
            
                if ( $jq('.climInput').val() ) {
                    var peopleSet = true;
                } else {
                    var peopleSet = false;
                }
                
                if ( countrySet && peopleSet ) {
                    $jq('.addConfirm').removeClass('disabled');
                } else {
                    $jq('.addConfirm').addClass('disabled');
                }
                    
            }, 200);
            
            // confirm
            $jq('.addConfirm').click(function(){
                if ( !$jq('.addConfirm').hasClass('disabled') ) {
                    
                    $jq('.addPopup').removeClass('open');
                    
                    var country = $jq('.climCountry').val();
                    var countryText = $jq('.climCountry option:selected').attr('data-html');
                    var people = $jq('.climInput').val();
                    
                    var count = people+' Team Member';
                    if ( people > 1 ) {
                        var count = count + 's';
                    }
                    $jq('.memberList').append('<div class="member" data-country-id="'+country+'" data-people="'+people+'"><div><strong>'+countryText+'</strong>'+count+'</div><a class="deleteMember"><svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2.5V3.5C16 3.63261 15.9473 3.75979 15.8536 3.85355C15.7598 3.94732 15.6326 4 15.5 4H0.5C0.367392 4 0.240215 3.94732 0.146447 3.85355C0.0526785 3.75979 0 3.63261 0 3.5V2.5C0 2.36739 0.0526785 2.24021 0.146447 2.14645C0.240215 2.05268 0.367392 2 0.5 2H5V1C5 0.734784 5.10536 0.48043 5.29289 0.292893C5.48043 0.105357 5.73478 0 6 0H10C10.2652 0 10.5196 0.105357 10.7071 0.292893C10.8946 0.48043 11 0.734784 11 1V2H15.5C15.6326 2 15.7598 2.05268 15.8536 2.14645C15.9473 2.24021 16 2.36739 16 2.5ZM1.87 18.14C1.90549 18.6458 2.13177 19.1192 2.50307 19.4646C2.87436 19.8099 3.36296 20.0012 3.87 20H12.15C12.657 20.0012 13.1456 19.8099 13.5169 19.4646C13.8882 19.1192 14.1145 18.6458 14.15 18.14L15 6H1L1.87 18.14Z" fill="#CECED1"/></svg></a></div>');
                    
                    initDelete();
                    
                    calcResult();

                }
            });
        
    });