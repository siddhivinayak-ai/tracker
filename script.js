let map, directionsService, directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
    zoom: 13,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const originInput = document.getElementById("origin");
  const destinationInput = document.getElementById("destination");

  // Add autocomplete functionality
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

  document.getElementById("find-route").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (!origin || !destination) {
    alert("Please enter both origin and destination.");
    return;
  }

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        // Calculate fare (for simplicity, assume $2 per km)
        const route = response.routes[0];
        const distanceInMeters = route.legs[0].distance.value;
        const fare = (distanceInMeters / 1000) * 2;
        document.getElementById("fare").textContent = fare.toFixed(2);

        // Simulate taxi drivers (random points near route)
        simulateTaxiDrivers(route);
      } else {
        alert("Directions request failed due to " + status);
      }
    }
  );
}

function simulateTaxiDrivers(route) {
  const taxiLocations = [
    { lat: route.legs[0].start_location.lat(), lng: route.legs[0].start_location.lng() },
    { lat: route.legs[0].end_location.lat(), lng: route.legs[0].end_location.lng() },
    // Add more random locations along the route
  ];

  taxiLocations.forEach((location) => {
    new google.maps.Marker({
      position: location,
      map: map,
      icon: "https://maps.google.com/mapfiles/ms/icons/cabs.png", // Add taxi icon URL
    });
  });
}

// Initialize the map
window.onload = initMap;
