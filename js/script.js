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
            url: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Right-Chartreuse-icon.png",
            width: "30px",
            height: "30px"
        };
            
    var sulphSym = {
            type: "picture-marker",
            url: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Right-Azure-icon.png",
            //url: "https://png.pngtree.com/element_origin_min_pic/16/12/15/eb4530ffe83dc176006586dd6bff701c.jpg",
            //url: "http://resources.esri.com/help/900/arcgisexplorer/sdk/doc/bitmaps/148cca9a-87a8-42bd-9da4-5fe427b6fb7b127.png",
            width: "30px",
            height: "30px"
        };
            
    var canSym = {
            type: "picture-marker",
            url: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Right-Pink-icon.png",
            width: "30px",
            height: "30px"
        };
            
    var rmnpTrailsSym = {
            type: "picture-marker",
            url: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Right-Pink-icon.png",
            width: "30px",
            height: "30px"
        };
            
    var rmnpSym = {
            type: "picture-marker",
            url: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Right-Pink-icon.png",
            width: "30px",
            height: "30px"
        };

    var defaultSym = {
            type: "simple-marker",
            color: "#FFAAFF",
            size: 7,
            style: "solid"
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
                value: "Rocky MountainNational Park",
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