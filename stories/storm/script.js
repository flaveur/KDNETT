        // Alle artikler starter usynlige og 100px nede...
        gsap.set(".city-section .article", { opacity: 0, y: 100 });

        // ...men de to innledende artiklene skal være fullt synlige fra start
        gsap.set("#section-intro-article .article, #section-del1 .article", { opacity: 1, y: 0 });

        const map = L.map('map', {
            dragging: false, touchZoom: false, doubleClickZoom: false,
            scrollWheelZoom: false, boxZoom: false, keyboard: false, zoomControl: false
        }).setView([61, 9], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const proxy = { lat: 61, lng: 9, zoom: 6 };
        gsap.ticker.add(() => map.setView([proxy.lat, proxy.lng], proxy.zoom, { animate: false }));

        const cities = [
            { s: 'section-intro-article', lat: 61,    lng: 9,     zoom: 6 },
            { s: 'section-del1',          lat: 61,    lng: 9,     zoom: 6 },
            { s: 'section-bergen',       lat: 60.392,lng: 5.324, zoom: 12 },
            { s: 'section-kristiansand', lat: 58.146,lng: 7.996, zoom: 12 },
            { s: 'section-sarpsborg',    lat: 59.284,lng: 11.110,zoom: 12 },
            { s: 'section-elverum',      lat: 60.882,lng: 11.562,zoom: 12 },
            { s: 'section-roros',        lat: 62.574,lng: 11.384,zoom: 12 },
            { s: 'section-trondheim',    lat: 63.430,lng: 10.393,zoom: 12 }
        ];

        let current = -1;

        cities.forEach((city, i) => {
            ScrollTrigger.create({
                trigger: `#${city.s}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => { if (i !== current) flyToCity(i); },
                onEnterBack: () => { if (i !== current) flyToCity(i); }
            });
        });

        function flyToCity(i) {
            const city = cities[i];
            const article = document.querySelector(`#${city.s} .article`);

            // De to første (intro + del1) skal ikke animeres inn
            if (i <= 1) {
                gsap.to(proxy, { lat: city.lat, lng: city.lng, zoom: city.zoom, duration: 0 });
                current = i;
                return;
            }

            // Alle by-artiklene får fly-inn + fade-inn
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

        // Start på oversikt (ingen animasjon)
        flyToCity(0);