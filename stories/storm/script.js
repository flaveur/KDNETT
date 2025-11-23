        // Alle artikler starter usynlige og 100px ned
        gsap.set(".city-section .article", { opacity: 0, y: 100 });

        // unntak av de to første
        gsap.set("#section-intro-article .article, #section-del1 .article", { opacity: 1, y: 0 });

        const map = L.map('map', {
            dragging: false, touchZoom: false, doubleClickZoom: false,
            scrollWheelZoom: false, boxZoom: false, keyboard: false, zoomControl: false
        }).setView([61, 9], 6);


        //API
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const proxy = { lat: 61, lng: 9, zoom: 6 };
        gsap.ticker.add(() => map.setView([proxy.lat, proxy.lng], proxy.zoom, { animate: false }));


        // Byene med koordinater og zoom-nivå
        const cities = [
            { s: 'section-intro-article', lat: 61,    lng: 9,     zoom: 6 },
            { s: 'section-del1',          lat: 61,    lng: 9,     zoom: 6 },
            { s: 'section-bergen',       lat: 60.392,lng: 5.324, zoom: 12, name: 'Bergen' },
            { s: 'section-kristiansand', lat: 58.146,lng: 7.996, zoom: 12, name: 'Kristiansand' },
            { s: 'section-sarpsborg',    lat: 59.284,lng: 11.110,zoom: 12, name: 'Sarpsborg' },
            { s: 'section-elverum',      lat: 60.882,lng: 11.562,zoom: 12, name: 'Elverum' },
            { s: 'section-roros',        lat: 62.574,lng: 11.384,zoom: 12, name: 'Røros' },
            { s: 'section-trondheim',    lat: 63.430,lng: 10.393,zoom: 12, name: 'Trondheim' }
        ];

        let current = -1;
        const markers = [];

        // Legg til markører for hver by (men skjul dem til senere)
        cities.forEach((city, i) => {
            if (i > 1 && city.name) { // Skip intro og del1
                const marker = L.marker([city.lat, city.lng], {
                    opacity: 0
                }).addTo(map);
                marker.bindPopup(`<b>${city.name}</b>`);
                markers.push({ marker, city, index: i });
            }
        });

        cities.forEach((city, i) => {
            ScrollTrigger.create({
                trigger: `#${city.s}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => { if (i !== current) flyToCity(i); },
                onEnterBack: () => { if (i !== current) flyToCity(i); }
            });
        });

        // Når oversikt-seksjonen kommer i view, zoom ut og vis alle markører
        ScrollTrigger.create({
            trigger: "#section-overview",
            start: "top center",
            onEnter: () => showOverview(),
            onEnterBack: () => showOverview()
        });

        function flyToCity(i) {
            const city = cities[i];
            const article = document.querySelector(`#${city.s} .article`);

            // Skjul alle markører når vi zoomer inn på en by
            markers.forEach(({ marker }) => {
                marker.setOpacity(0);
            });

            // De to første skal ikke animeres inn
            if (i <= 1) {
                gsap.to(proxy, { lat: city.lat, lng: city.lng, zoom: city.zoom, duration: 0 });
                current = i;
                return;
            }

            // Alle by-artiklene får flight og fade
            gsap.set(article, { opacity: 0, y: 100 });

            gsap.to(proxy, {
                lat: city.lat,
                lng: city.lng,
                zoom: city.zoom,
                duration: 2.4,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to(article, {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power2.out",
                        delay: 0.5
                    });
                }
            });

            current = i;
        }

        function showOverview() {
            // Zoom ut til oversikt over Norge
            gsap.to(proxy, {
                lat: 61,
                lng: 9,
                zoom: 6,
                duration: 2,
                ease: "power2.inOut"
            });

            // Vis alle markører
            markers.forEach(({ marker }) => {
                setTimeout(() => {
                    marker.setOpacity(1);
                }, 1500);
            });

            current = 0; // Reset til oversikt
        }

        // Klikk-hendelser for knappene
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cityName = btn.dataset.city;
                const cityData = cities.find(c => c.s === `section-${cityName}`);
                
                if (cityData) {
                    // Scroll til seksjonen
                    const section = document.getElementById(cityData.s);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        });

        // Start på oversikt
        flyToCity(0);
