/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {
        
    var pluginName = "strenNgen",
        defaults = {
            confirmPassword: '',
            strengthMeterBar: '',
            generatePassword: '',
            progressBar: '.progress-bar',
            strengthMeterLabel: '',
            minStrengthValid: 6,
            minPasswordLength: 8
        };

       // $('<style>body { background-color: red; color: white; }</style>').appendTo('head');

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    


    Plugin.prototype = {

        init: function() {
                
            var confirmPassword    = this.options.confirmPassword,
                strengthMeterBar   = this.options.strengthMeterBar,
                generatePassword   = this.options.generatePassword,
                progressBar        = this.options.progressBar,
                strengthMeterLabel = this.options.strengthMeterLabel,
                minStrengthValid   = this.options.minStrengthValid,
                minPasswordLength  = this.options.minPasswordLength,
                me = this.$elem;
            
            var strengthMeterBar    = $( strengthMeterBar ),
                progressBar         = strengthMeterBar.children( progressBar );

                
            progressBar.text( strengthMeterLabel );
            
            var forbiddenSequences = [
                                        '0123456789',
                                        'abcdefghijklmnopqrstuvwxyz',
                                        'qwertyuiop',
                                        'asdfghjkl',
                                        'zxcvbnm',
                                        '!@#$%^&*()_+'
                                     ];

            var scoreChars              = 0;
            var scoreUppercase          = 0;
            var scoreLowercase          = 0;
            var scoreOneNumber          = 0;
            var scoreThreeNumbers       = 0;
            var scoreOneSpecialChar     = 0;
            var scoreTwoSpecialChar     = 0;
            var scoreRepetitions        = 0; 
            
            var wordLowercase           = new RegExp( '[a-z]' );
            var wordUppercase           = new RegExp( '[A-Z]' );
            var wordOneNumber           = new RegExp( '[0-9]' );
            var wordThreeNumbers        = new RegExp( '(.*[0-9].*[0-9].*[0-9])' );
            var wordOneSpecialChar      = new RegExp( '([!,%,&,@,#,$,^,*,?,_,~])' );
            var wordTwoSpecialChar      = new RegExp( '(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])' );

            function GetPercentage( a, b ) {
             return ( ( b / a ) * 100 );
            }

            function calc_strength( thisval ){
                    
             if( thisval.length >= minPasswordLength ){
              scoreChars                = 1;
             }else{
              scoreChars                = -1;
             }
             if( thisval.match( wordLowercase ) ){
              scoreLowercase            = 1;
             }else{
              scoreLowercase            = 0;
             }
             if( thisval.match( wordUppercase ) ){
              scoreUppercase            = 1;
             }else{ 
              scoreUppercase            = 0;
             }
             if( thisval.match( wordOneNumber ) ){
              scoreOneNumber            = 1;
             }else{
              scoreOneNumber            = 0;
             }
             if( thisval.match( wordThreeNumbers ) ){
              scoreThreeNumbers         = 1;
             }else{
              scoreThreeNumbers         = 0;
             }
             if( thisval.match( wordOneSpecialChar ) ){
              scoreOneSpecialChar       = 1;
             }else{
              scoreOneSpecialChar       = 0;
             }
             if( thisval.match( wordTwoSpecialChar ) ){
              scoreTwoSpecialChar       = 1;
             }else{
              scoreTwoSpecialChar       = 0;
             }

             
             var total = scoreChars + scoreUppercase + scoreLowercase +  scoreOneNumber + scoreThreeNumbers + scoreOneSpecialChar + scoreTwoSpecialChar;
             var totalpercent = GetPercentage( 7, total ).toFixed(0);
             
             if( !thisval.length ){
              total = -1;
             }

             write_strength( total, totalpercent );
             
            }

            function write_strength( total, totalpercent ){

             progressBar.animate( { width: totalpercent + '%' }, 10 );

             if( total == -1 ){
              strengthMeterBar.removeClass().children( progressBar ).text( strengthMeterLabel );
             }else{
                     
              if( total == 2 ||  total == 3 ){
               strengthClass   = 'weak';
               strengthMessage = 'Weak';
              }
              else if( total == 4 ){
               strengthClass   = 'medium';
               strengthMessage = 'Medium';
              }
              else if( total == 5 | total == 6 ){
               strengthClass   = 'strong';
               strengthMessage = 'Strong';
              }
              else if( total >= 7 ){
               strengthClass   = 'verystrong';
               strengthMessage = 'Very strong';
              }
              else{
               strengthClass   = 'tooweak';
               strengthMessage = 'Too weak';    
              }   
              
              strengthMeterBar.attr( 'class', strengthClass ).children( progressBar ).text( strengthMessage );
                     
             }
  
             if( total >= minStrengthValid ){
              me.removeClass( 'invalid-password' );  
             }else{
              me.addClass( 'invalid-password' );  
             }
  
            }



            $( me ).bind( 'keyup keydown', function( e ) {
             calc_strength( $( this ).val() );
            });
            
            $( document ).ready(function() { //Quick dirty 
             calc_strength( $( me ).val() );
            })
            
            $( generatePassword ).bind( 'click', function( e ) {
                    
             var  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
                  numbs = '01234567890',
                  spesh = '!@#$%^_~*?',
                  randomstring = '';
                  
             for ( var i = 0; i < minPasswordLength; i++ ) {
              if( i == 4 || i == 9 || i == 14 ){ 
               targ =  spesh;
              }else if( i == 2 || i == 6 ){    
               targ = numbs;      
              }else{      
               targ = chars;
              }
              var rnum = Math.floor( Math.random() * targ.length );
              randomstring += targ.substring( rnum, rnum +1 );
             }
             
             $( me ).val( randomstring );
             if( confirmPassword != '' ){
              $( confirmPassword ).val( randomstring );
             }
             calc_strength( $( me ).val() );
             
            });
            
            
            
            
            


        },


    };


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


