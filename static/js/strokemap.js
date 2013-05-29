
var data,
    tsa,
    tsa_zones,
    states,
    counties,
    hospitals,
    tooltip,
    tooltip_facilities,
    svg,
    size       = [710, 500],
    margin     = 25,
    width      = window.innerWidth  - margin,
    height     = window.innerHeight - margin;

var albers = d3.geo.albers()
                .scale(2500)
                .parallels([30, 30])
                .translate([480, -70]);
var albers_path = d3.geo.path().projection(albers);

var tsa_names = {
    "A": "Panhandle",
    "B": "BRAC",
    "C": "North Texas",
    "D": "Big Country",
    "E": "North Central Texas",
    "F": "Northeast Texas",
    "G": "Piney Woods",
    "H": "Deep East Texas",
    "I": "Border",
    "J": "Texas 'J'",
    "K": "Concho Valley",
    "L": "Central Texas",
    "M": "Heart of Texas",
    "N": "Brazos Valley",
    "O": "Capital Area Trauma",
    "P": "Southwest Texas",
    "Q": "Southeast Texas Trauma",
    "R": "East Texas Gulf Coast",
    "S": "Golden Cresent",
    "T": "Seven Flags",
    "U": "Coastal Bend",
    "V": "Lower Rio Grande Valley"
}

// create the div that will hold the TSA zone name
// to be activated whenever the user rolls said zone.
tooltip = d3.select("#stroke_map")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("unknown");

// create the div that will hold the hospital names
tooltip_facilities = d3.select("#stroke_map")
    .append("div")
    .attr("id", "tooltip_facilities")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("unknown");

// get the classes for the TSA areas
d3.json("data/tsa.json", function(json) { tsa = json;})

// create your SVG canvas
svg = d3.select("#stroke_map")
    .append("svg")
    .call(d3.behavior.zoom()
        .scaleExtent([0, 4])
        .on("zoom", redraw))
        .append("g");

// create a group for holding states, tsa-zones, and counties
states   = svg.append("g").attr("id", "states");
tsazones = svg.append("g").attr("id", "tsazones");
counties = svg.append("g").attr("id", "counties");

// load county data
d3.json("data/tx-counties.json", function(json) {

    counties.selectAll("path")
        .data(json.features).enter()
        .append("path")
        .attr("class", function(d) { return tsa[d.id]; })
        .on("mouseover", function(d) {
            // put TSA zone name in div on rollover
            $("#tooltip").html(tsa_names[tsa[d.id]]);
            return tooltip.style("visibility", "visible");
        })
        .on("mouseout", function(){
            // TODO - move this mouseout function to the group
            // holding the state of texas boundaries, so that if the mouse
            // moves off of texas the tooltip gets hidden.
            // return tooltip.style("visibility", "hidden");
        })
        .attr("d", albers_path)
        .append("county").text(function(d) {
            var c = d.geometry.coordinates[0][0];

            if(c[0] > width/2) {
                if(c[1] > height/2) {
                    $(this).parent().tipsy({gravity:'se'});
                } else {
                    $(this).parent().tipsy({gravity:'ne'});
                }
            } else {
                if(c[1] > height/2) {
                    $(this).parent().tipsy({gravity:'sw'});
                } else {
                    $(this).parent().tipsy({gravity:'nw'});
                }
            }
            // insert information into the county tag
            // that includes [county_name]: [stats]
            // if stats are not present then use 'n/a' for 'not available'
            return d.p.n + ": " + (d.p.g > 0 ? d.p.g : "n/a");
        });
});

// load the geo-json for creating the states
d3.json("data/us-states.json", function(json) {
  states.selectAll("path")
      .data(json.features).enter()
      .append("path")
      .attr("d", albers_path);
});

hospitals = svg.append("g")
    .attr("id", "hospitals");

d3.json("data/facilities.json", function(json) {
    hospitals.selectAll("circle")
        .data(json).enter()
        .append("svg:circle")
        .attr("fill", "red")
        .style("stroke", "white")
        .style("stroke-width", ".2px")
        .attr("r", 1)
        .attr("cx", function(d, i) {
              var coords = albers([d['latitude'], d['longitude']]);
              return coords[0];
        })
        .attr("cy", function(d, i) {
              var coords = albers([d['latitude'], d['longitude']]);
              return coords[1];
        })
        .on("mouseover", function(d) {
            d3.select(this)
                .transition().duration(300)
                .attr('r', 5);

            // add tooltips
            $("#tooltip_facilities").html(d['facility_name']);
            return tooltip_facilities.style("visibility", "visible");
        })
        .on("mousemove", function() {
            var tips = tooltip_facilities
                .style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px");
            return tips;
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(600)
                .attr('r', 1);
            return tooltip_facilities.style("visibility", "hidden");
        });
});

function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

//----------------------------------------------------------------------------
//                                DAT.GUI
//----------------------------------------------------------------------------

var GuiText = function() {
    this.message        = 'Stroke Mortality';
    this.year           = '200 - 2006';
    this.gender         = 'both';
    this.race           = 'All Groups';
    this.opacity        = 0.8;
    //this.displayOutline = false;
    this.reset = function() {
        console.log('reset()');
    };
    // Define render logic ...
};

window.onload = function() {

    var text = new GuiText(),
        gui  = new dat.GUI({ autoPlace: false });

    var customContainer = document.getElementById('stroke_map_controls');
    customContainer.appendChild(gui.domElement);

    gui.add(text, 'message');
    gui.add(text, 'year', ['2000 - 2006', '1991 - 1998']);
    gui.add(text, 'gender', ['both', 'male', 'female']);
    gui.add(text, 'race', {
        'All Groups': 0,
        'Native American': 1,
        'Asian American': 2,
        'African American': 3,
        'Caucasian': 4
    });
    gui.add(text, 'opacity', -5, 5);
    gui.add(text, 'reset');
};



