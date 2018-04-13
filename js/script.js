require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/ScaleBar",
    "esri/widgets/Home",
    "dojo/domReady!"
], function (
    Map,
    MapView,
    FeatureLayer,
    ScaleBar,
    Home
) {
    var map = new Map({
            basemap: "topo"
        });
                
    var view = new MapView({
            map: map,
            center: [-105.85, 40.25],
            zoom: 9,
            container: "viewDiv"
           /*extent: {
                xmin: -11887504,
                ymin: 4777124,
                xmax: -11678831,
                ymax: 5009552,
                spatialReference: {
                    wkid: 102100
                }
            }*/
        });
            
    //Remove default zoom buttons from upper left of map
    view.ui.remove("zoom");
            
    //Create scale bar in lower left showing both english and metric units
    var scaleBar = new ScaleBar({
            view: view,
            unit: "dual"
        });
            
    view.ui.add(scaleBar, {
        position: "bottom-left"
    });
            
    //Add home button to reset view to original extent after the map has been panned or zoomed
    var homeButton = new Home({
            view: view
        });
            
    view.ui.add(homeButton, "top-right");
            
    //Popup box settings, moved to upper left by default
    view.popup.dockEnabled = true;
    view.popup.dockOptions = {
        buttonEnabled: false,
        breakpoint: false,
        position: "top-left",
        autoCloseEnabled: true
    };
            
    //Create symbols that are rendered based on PARK_NAME field from the database
    var bouldSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };
            
    var sulphSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };
            
    var canSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/YellowStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };
            
    var rmnpTrailsSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/OrangeStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };
            
    var rmnpSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/BlueStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };

    var defaultSym = {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/BlackStickpin.png",
            width: "30px",
            height: "30px",
            angle: 30
        };
            
    var symRenderer = {
            type: "unique-value",
            defaultSymbol: defaultSym,
            defaultLabel: "No Park Defined",
            field: "PARK_NAME",
            uniqueValueInfos: [{
                value: "Boulder Ranger District",
                symbol: bouldSym
            }, {
                value: "Sulphur Ranger District",
                symbol: sulphSym
            }, {
                value: "Canyon Lakes Ranger District",
                symbol: canSym
            }, {
                value: "Rocky Mountain National Park Trails",
                symbol: rmnpTrailsSym
            }, {
                value: "Rocky Mountain National Park",
                symbol: rmnpSym
            }]
        };
            
    //Add database to the map, change this url if the location of the database service layer changes
    var sulphurPoints = new FeatureLayer({
            url: "https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/Trail_Coordinates_PEP1/FeatureServer/0",
            renderer: symRenderer,
                
            //Popup uses the NAME field for the title and DESCRIPTION field to display the work bring done at each site
            //Also displays an image based on the url provided in the IMG_URL field
            popupTemplate: {
                title: "<b>{NAME}</b>",
                content: [{
                    type: "text",
                    text: "{DESCRIPTION}"
                }, {
                    type: "media",
                    mediaInfos: [{
                        title: "",
                        type: "image",
                        value: {
                            sourceURL: "{IMG_URL}"
                        }
                    }]
                }]
            },
            outFields: ["*"]
        });
    map.add(sulphurPoints);
});