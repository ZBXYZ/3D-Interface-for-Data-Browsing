//import other packages
//d3 package
import './scripts/d3.min.js';
//css
import './css/style.css';
//mapbox
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
//for drawing 3D objects
import './scripts/threebox.js';

// Public Token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FvbWVuZ3lhbyIsImEiOiJja2lxZjhiem8xdTF3MnNsYjQwMHlndHljIn0.tLfP2eEXpTxfujpzOyhz_A';

// CB Controls vars
var cbAll = d3.select("#cb0");
var cb1 = d3.select("#cb1");
var cb2 = d3.select("#cb2");
var cb3 = d3.select("#cb3");
var cb4 = d3.select("#cb4");
var cb5 = d3.select("#cb5");
var cb6 = d3.select("#cb6");
var cb7 = d3.select("#cb7");
var cb8 = d3.select("#cb8");
var cb9 = d3.select("#cb9");
var cb10 = d3.select("#cb10");
var cb11 = d3.select("#cb11");
var cb12 = d3.select("#cb12");
var cb13 = d3.select("#cb13");
var cbn = d3.selectAll(".cbn");
var cbcAll = d3.select("#cbc0");
var cbc1 = d3.select("#cbc1");
var cbc2 = d3.select("#cbc2");
var cbc3 = d3.select("#cbc3");
var cbc4 = d3.select("#cbc4");
var cbc = d3.selectAll(".cbc");

//3D scene related vars
let tb;
const mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();;
let INTERSECTED;

//Store the coordinates
var positions;
var fileterCatogeries;


//Popup related vars
let containers = d3.selectAll("#popup p span");
let cate = d3.select("#popup p");
let pop = d3.select("#popup");

//Map origin
var origin = [119.5, 33.0, 0];

// About Module Callbacks
d3.select("#about-map-button").on("click", function () {
    d3.select("#about").style("display", "none");
});

d3.select("#about-close").on("click", function () {
    d3.select("#about").style("display", "none");
});

d3.select("#about").on("click", function () {
    d3.select("#about").style("display", "none");
});

d3.select("#about-link").on("click", function () {
    d3.select("#about").style("display", "block");
});

d3.select(".coverpage a").on("click", function () {
    d3.select(".coverpage").style("display", "none");
})

//Load data function
async function init() {
    const request = await fetch("./assets/deleted.json");
    const data = await request.json();
    positions = data.data;
    fileterCatogeries = JSON.parse(JSON.stringify(positions));
}
init();

//Create map and controls
var map = new mapboxgl.Map({
    style: 'mapbox://styles/gaomengyao/ckmc2ql5v3j7217ql8lizt5j9',
    // style: 'mapbox://styles/mapbox/streets-v11',
    container: 'map',
    center: origin,
    zoom: 6.8,
    pitch: 55,
    bearing: 17
});
var scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
map.addControl(scale);
scale.setUnit('metric');

map.on('style.load', function () {
    addCustom(positions);
    // Init a set of all districts.
    var filter = new Set([3201, 3202, 3203, 3204, 3205, 3206, 3207, 3208, 3209, 3210, 3211, 3212, 3213]);
    var districts = Array.from(filter);

    // Filter for data category
    var filterCat = new Set(['economic', 'geographic', 'paper', 'night']);
    var categories = Array.from(filterCat);

    //add event listener to checked options for each city
    cbn.on("change", function () {

        // Add and remove callbacks.
        (cb1.property("checked")) ? filter.add(3201) : filter.delete(3201);
        (cb2.property("checked")) ? filter.add(3202) : filter.delete(3202);
        (cb3.property("checked")) ? filter.add(3203) : filter.delete(3203);
        (cb4.property("checked")) ? filter.add(3204) : filter.delete(3204);
        (cb5.property("checked")) ? filter.add(3205) : filter.delete(3205);
        (cb6.property("checked")) ? filter.add(3206) : filter.delete(3206);
        (cb7.property("checked")) ? filter.add(3207) : filter.delete(3207);
        (cb8.property("checked")) ? filter.add(3208) : filter.delete(3208);
        (cb9.property("checked")) ? filter.add(3209) : filter.delete(3209);
        (cb10.property("checked")) ? filter.add(3210) : filter.delete(3210);
        (cb11.property("checked")) ? filter.add(3211) : filter.delete(3211);
        (cb12.property("checked")) ? filter.add(3212) : filter.delete(3212);
        (cb13.property("checked")) ? filter.add(3213) : filter.delete(3213);

        //change the state of the all checked checkbox
        let flag = true;
        for (let value of districts) {
            if (!filter.has(value)) {
                flag = false;
            }
        }
        if (flag) {
            cbAll.property('checked', true);
        }
        else {
            cbAll.property('checked', false);
        }

        filterApply();
    });

    //add event listener to the all checked option for cities
    cbAll.on("change", function () {
        let flag = true;
        if (cbAll.property("checked")) {
            filter = new Set([3201, 3202, 3203, 3204, 3205, 3206, 3207, 3208, 3209, 3210, 3211, 3212, 3213]);
        }
        else {
            filter.clear();
            flag = false;
        }
        //set all checkbox]
        cb1.property("checked", flag);
        cb2.property("checked", flag);
        cb3.property("checked", flag);
        cb4.property("checked", flag);
        cb5.property("checked", flag);
        cb6.property("checked", flag);
        cb7.property("checked", flag);
        cb8.property("checked", flag);
        cb9.property("checked", flag);
        cb10.property("checked", flag);
        cb11.property("checked", flag);
        cb12.property("checked", flag);
        cb13.property("checked", flag);

        filterApply();
    });

    //add event listener to checked options for each category
    cbc.on("change", function () {

        // Add and remove callbacks.
        (cbc1.property("checked")) ? filterCat.add('geographic') : filterCat.delete('geographic');
        (cbc2.property("checked")) ? filterCat.add('economic') : filterCat.delete('economic');
        (cbc3.property("checked")) ? filterCat.add('paper') : filterCat.delete('paper');
        (cbc4.property("checked")) ? filterCat.add('night') : filterCat.delete('night');

        //change the state of the all checked checkbox
        let flag = true;
        for (let value of categories) {
            if (!filterCat.has(value)) {
                flag = false;
            }
        }
        if (flag) {
            cbcAll.property('checked', true);
        }
        else {
            cbcAll.property('checked', false);
        }

        filterApply();
    });

    //add event listener to the all checked option for categories
    cbcAll.on("change", function () {
        let flag = true;
        if (cbcAll.property("checked")) {
            filterCat = new Set(['economic', 'geographic', 'paper', 'night']);
        }
        else {
            filterCat.clear();
            flag = false;
        }
        //set all checkbox]
        cbc1.property("checked", flag);
        cbc2.property("checked", flag);
        cbc3.property("checked", flag);
        cbc4.property("checked", flag);

        filterApply();
    });

    //apply filter function
    var filterApply = function () {
        // Set the filter based on the set.
        fileterCatogeries = positions.map(element => {
            let ele = JSON.parse(JSON.stringify(element));
            if (filter.has(ele.postcode)) {
                let attArr = Object.keys(ele);
                for (let i = 2; i < attArr.length; i++) {
                    let att = attArr[i];
                    if (!filterCat.has(att)) {
                        delete ele[att];
                    }
                }
                return ele;
            }
        })
        console.log(fileterCatogeries);
        map.removeLayer("custom_layer");
        addCustom(fileterCatogeries);
    }

});

//Get the intersected 3D object
function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, tb.camera);

    const intersects = raycaster.intersectObjects(tb.scene.children[0].children);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            popup(INTERSECTED, event.clientX, event.clientY);
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

        }

    } else {
        pop.style('display', 'none');

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }
    map.triggerRepaint();
}

//Show the popup
let popup = function (obj, x, y) {

    let data = obj.data;

    containers[0][0].innerHTML = data.time;
    containers[0][1].innerHTML = data.completeness.toFixed(2);
    containers[0][2].innerHTML = data.size;

    cate.html(data.category);
    pop.style('display', 'block');
    pop.style('left', x + 10 + 'px');
    pop.style('top', y + 10 + "px");
}

//Add customized layer 
let addCustom = function (positions) {
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        onAdd: function (map, mbxContext) {
            tb = new Threebox(
                map,
                mbxContext,
                { defaultLights: true }
            );

            for (let j = 0; j < positions.length; j++) {
                if (!positions[j]) continue;
                for (let i = 0; i < 12; i++) {

                    if (positions[j].geographic) {
                        let geographicSize = (positions[j].geographic.data[i].size) == 0 ? 10 : (positions[j].geographic.data[i].size) * 0.9 + 50;
                        let geoGeometry = new THREE.BoxGeometry(geographicSize, geographicSize, 230);
                        let greenMaterial = new THREE.MeshPhongMaterial({
                            color: 0x6b705c,
                            side: THREE.FrontSide,
                            opacity: positions[j].geographic.data[i].completeness
                        });
                        let cube = new THREE.Mesh(geoGeometry, greenMaterial);
                        cube = tb.Object3D({ obj: cube })
                            .setCoords([positions[j].geographic.longitudeGeo, positions[j].latitude, i * 11000]);
                        cube.data = positions[j].geographic.data[i];
                        cube.data.category = "Geographic";
                        tb.add(cube);
                    }

                    if (positions[j].night) {
                        let nightSize = positions[j].night.data[i].size == 0 ? 10 : (positions[j].night.data[i].size) * 0.9 + 50;
                        let nightGeometry = new THREE.BoxGeometry(nightSize, nightSize, 230);
                        //texture test
                        let blackMaterial = new THREE.MeshPhongMaterial({
                            color: 0x213C3C,
                            side: THREE.FrontSide,
                            opacity: positions[j].night.data[i].completeness,
                        });
                        let cube4 = new THREE.Mesh(nightGeometry, blackMaterial);
                        cube4 = tb.Object3D({ obj: cube4 })
                            .setCoords([positions[j].night.longitudeNight, positions[j].latitude, i * 11000]);
                        cube4.data = positions[j].night.data[i];
                        cube4.data.category = "Nighttime Light";
                        tb.add(cube4);
                    }

                    if (positions[j].economic) {
                        let economicSize = (positions[j].economic.data[i].size) == 0 ? 10 : (positions[j].economic.data[i].size) * 0.9 + 50;
                        let economicGeometry = new THREE.BoxGeometry(economicSize, economicSize, 230);
                        let redMaterial = new THREE.MeshPhongMaterial({
                            color: 0x631a18,
                            side: THREE.FrontSide,
                            opacity: positions[j].economic.data[i].completeness,
                        });
                        let cube2 = new THREE.Mesh(economicGeometry, redMaterial);
                        cube2 = tb.Object3D({ obj: cube2 })
                            .setCoords([positions[j].economic.longitudeEco, positions[j].latitude, i * 11000]);
                        cube2.data = positions[j].economic.data[i];
                        cube2.data.category = "Economic";
                        tb.add(cube2);
                    }

                    if (positions[j].paper) {
                        let paperSize = (positions[j].paper.data[i].size) == 0 ? 10 : (positions[j].paper.data[i].size) * 0.9 + 50;
                        let paperGeometry = new THREE.BoxGeometry(paperSize, paperSize, 230);
                        let yellowMaterial = new THREE.MeshPhongMaterial({
                            color: 0x975843,
                            side: THREE.FrontSide,
                            opacity: positions[j].paper.data[i].completeness,
                        });
                        let cube3 = new THREE.Mesh(paperGeometry, yellowMaterial);
                        cube3 = tb.Object3D({ obj: cube3 })
                            .setCoords([positions[j].paper.longitudePaper, positions[j].latitude, i * 11000]);
                        cube3.data = positions[j].paper.data[i];
                        cube3.data.category = "Social";
                        tb.add(cube3);
                    }

                }
            }

            document.addEventListener('mousemove', onDocumentMouseMove);
        },
        render: function (gl, matrix) {
            tb.update();
        }
    });
}
// Set default map cursor to a hand.
map.getCanvas().style.cursor = "default";