
window.addEventListener("load", function() {

    const inputElement = document.getElementById('telefono');
  
    inputElement.addEventListener('keydown',enforceFormat);
    inputElement.addEventListener('keyup',formatToPhone);


// Open and close menu modal
    const openMenu = document.getElementById('open-menu');
    const closeMenu = document.getElementById('close-menu');
    if(openMenu != null) {
        const menu = document.querySelector('.header-menu');
        const overlay = document.querySelector('.menu-overlay');
        openMenu.addEventListener('click', (event) => {
            event.preventDefault();
            menu.setAttribute('class', 'header-menu slide-in');
            overlay.addClass('slide-in');

            const linkScroll = document.querySelectorAll('.header-menu .item-scroll');
            if(linkScroll.length > 0) {
                linkScroll.forEach(item => {
                    item.addEventListener('click', (event) => {
                        event.preventDefault();
                        closeMenu.dispatchEvent(eventClick);
                    });
                });
            }

        });
    }

    
    if(closeMenu != null) {
        closeMenu.addEventListener('click', (event) => {
            event.preventDefault();
            const menu = document.querySelector('.header-menu');
            const overlay = document.querySelector('.menu-overlay');
            
            menu.setAttribute('class', 'header-menu slide-out');
            overlay.removeClass('active');

        });
    }

    let bannerClose = false;
    const cardFixed = document.querySelector('.card');
    const closeBanner = document.querySelector('.close-banner');
    //Lazy load industrias..
    if(!!window.IntersectionObserver) {
        let observer = new IntersectionObserver((entries, observer) => { 
            entries.forEach(entry => {
                
                if(entry.isIntersecting){
                    cardFixed.removeClass('fixed');  
                    closeBanner.removeClass('show');       
                } else {
                    if(!bannerClose){
                        if(entry.boundingClientRect.top < 0){
                            cardFixed.addClass('fixed');  
                            closeBanner.addClass('show');
                        }  
                    }
                    
                }
            });
        }, {rootMargin: "0px 0px -20px 0px"});
        observer.observe(document.querySelector('#handle-card'));
    }

    
    closeBanner.addEventListener('click', (event) => {
        event.preventDefault();
        bannerClose = true;
        cardFixed.removeClass('fixed');
        closeBanner.addClass('hidden');     

    }); 


});

//modal tratamiento
const modal  = document.querySelector('.modal-trigger');
  if(modal!=null) {
      modal.addEventListener('click', (event) => {
          event.preventDefault();
          const modalContent = document.getElementById('modal');
          const overlay = document.getElementById('overlay');

          modalContent.addClass('active');
          overlay.addClass('active');
          modalContent.firstChild.nextSibling.addEventListener('click', (e) => {
            modalContent.removeClass('active');
            overlay.removeClass('active');
          });
      });
}

// Funcionalida de google maps - Sucursales ICBC
let markers = [];   
let ubicacionUser;

function initMap() {

    if (!navigator.geolocation){
       console.warn('Geolocation not support');
        return;
    } 

    function success(position) {
        const coordenadas = position.coords;
        ubicacionUser = coordenadas.latitude + ',' + coordenadas.longitude;
        generarMap(coordenadas.latitude, coordenadas.longitude);
    }
      
    function error(error) {
        console.error('ERROR(' + error.code + '): ' + error.message);
    }

    const options = {
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
    }
      
    navigator.geolocation.watchPosition( success, error, options );
}

function generarMap(latitud, longitud) {
    const miUbicacion = new google.maps.LatLng(latitud, longitud);
    const map = new google.maps.Map(
        document.getElementById('map'), 
        {
            zoom: 13, 
            center: miUbicacion 
        }
    );

    //var marker = new google.maps.Marker({position: miUbicacion, map: map});
    showSucursales(map); 

    google.maps.event.addListener(map, 'dragend', function() {
        setMapOnAll(null);
        showSucursales(map); 
    });
}
  
function showSucursales(map) {
    const pyrmont = new google.maps.LatLng(map.center.lat(),map.center.lng());

            const request = {
                location: pyrmont,
                query: 'icbc',
                fields: ['name', 'geometry'],
              };
      
              service = new google.maps.places.PlacesService(map);
      
              service.textSearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                    setMarkers(results[i], map);
                  }
      
                  //map.setCenter(results[0].geometry.location);
                }
              });
}

function setMarkers(place, map) {
    var image = {
      url: './static/img/map.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 35)
    };
    
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };

    
    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        icon: image,
        shape: shape,
        title: place.formatted_address,
        name: place.name
    });

    markers.push(marker);

    var infowindow = new google.maps.InfoWindow({
        maxWidth: 300
    });

    marker.addListener('click', function(event) {
        const destino = marker.position.lat() + ',' + marker.position.lng();
        const centro = '@' + map.center.lat() + ',' + map.center.lng() + ',14z';
        infowindow.setContent('<div class="body-map"><strong>'+marker.name+'</strong><p>'+marker.title+'</p><a href="https://www.google.com/maps/dir/'+ubicacionUser+'/'+destino+'/'+centro+'" target="_blank" class="searchbox-directions">Como llegar</a></div>');
        infowindow.open(map, marker);
    });

    /*marker.addListener('mouseout', function(event) {
        infowindow.close();
    });*/

}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}


// Funcionalidad: Accordión
const acoordions = document.querySelectorAll('.step-accordion .card-accordion .card-link');
if(acoordions.length > 0) {
    acoordions.forEach(cardLink =>  {
        cardLink.addEventListener('click', (event) => {
            event.preventDefault();
           
            if(cardLink.parentElement.classList.contains('active')){
                cardLink.parentElement.removeClass('active');
            } else {
                const cardActives = document.querySelector('.step-accordion .card-accordion.active');
                if(cardActives!=null) cardActives.removeClass('active');
                
                cardLink.parentElement.addClass('active');
                
            }           
        });
    });
}

//ScrollTop
document.getElementById('scrollTop').addEventListener('click', (event) => {
    event.preventDefault();
    scrollBox('hero');
})

// Funcionalida menu nav scrollById
const navLinks = document.querySelectorAll('.header-menu .item-scroll');
if(navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href').slice(1);
            scrollBox(href);
            const itemActive =  document.querySelector('.header-menu .item-scroll.active');
            if(itemActive!=null) itemActive.removeClass('active');
            link.addClass('active');
            
        }); 
    });
}