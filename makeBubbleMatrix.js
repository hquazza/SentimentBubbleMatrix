export function makeBubbleMatrix(data, svg){
    const svgHeight = svg.attr('height')
    const svgWidth = svg.attr('width')
    const margin = {left: 200, right:130, top:120, bottom:50};
    
    const colour = d3
      .scaleOrdinal(['#0079eb', '#375071', '#9B7003'])
      .domain(['Positive', 'Mixed', 'Negative']);



    // <---------------------- FUNCTION - WRAP TEXT  ------------------------>

      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems (brought down to 1)
            x = text.attr('x'),
            y = text.attr('y'),
            dy = -.5, //parseFloat(text.attr("dy")),
            tspan = text
              .text(null)
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dy', dy + 'em');
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(' '));
              line = [word];
              tspan = text
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                .text(word);
            }
          }
          const totalHeight =
            lineNumber * lineHeight * text.attr('font-size'); // Approximate height in pixels
          text.attr(
            'transform',
            `translate(0, ${-totalHeight / 2})`,
          );
        });
      }
    
    // <---------------------- CONSTANTS NOT TO CHANGE ------------------------>
    
    // Create sorted labels (so that it's "1.A", "2.B"...)

    // Creates a list of the connected themes 
    const Theme = data.map(d=>d['Theme']).sort(d3.ascending)
    const ConnectedTheme = data.map(d=>d['Connected Theme']).sort(d3.ascending)

    const uniqueTheme = [...new Set(Theme)]
    const uniqueConnectedTheme = [...new Set(ConnectedTheme)]

  //   const sortedTheme =
  //   ["1. Access", 
  //     "2. Discharge", 
  //     "3. Care & Treatment",  
  //     "4. Crisis Care",
  //     "5. Inequalities",
  //     "6. Information & Admin",
  //     "7. Joined up Care",
  //     "8. Medication",
  //     "9. Person Centred Care",
  //     "10. Provision of Care",
  //     "11. Service & Staffing",
  //     "12. Staff Interaction",
  //     "13. Wider Landscape"
  // ]

  //   console.log(sortedTheme);

  //   const sortedConnectedTheme = data.map(d=>d['Connected Theme']).sort((a,b)=>{
  //     const [numA, letterA] = a.split('.');
  //     const [numB, letterB] = b.split('.');
  //     return parseInt(numA) - parseInt(numB);
  //   });

  //   const sortedConnectedTheme= sortedTheme;

    // Adding the tooltip
    const tooltip = d3
      .select('#tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('pointer-events', 'none');




    // const tooltipStatic = d3.select('body')
    // .selectAll('.tooltipStatic')
    // .data(data)
    // .attr('class', 'tooltipStatic')
    // .style('opacity',1)
    // .text('dummy');

    // X-Axis: the scale, the line, the text
    var xAxisV2 = d3
      .scalePoint()
      // .domain(sortedTheme)
      .domain(Theme)
      .range([margin.left+50, svgWidth - margin.right]);
    
      const xAxis = svg
      .selectAll('.axis--x')
      .data([null])
      .join('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${margin.top})`)
      .call(d3.axisBottom(xAxisV2).tickSize(0))
      
      xAxis.select('path')
      .remove()
    
      xAxis.selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'rotate(-35)')

    svg
      .selectAll('axisLabelX')
      .data([null])
      .join('text')
      .attr('class', 'axisLabelX axisLabel')
      .text('Theme')
      .attr('x', svgWidth / 2)
      .attr('y', margin.top / 5);
    
    // Y-Axis: the scale, the line, the text
    const yAxisV2 = d3
      .scalePoint()
      // .domain(sortedConnectedTheme)
      // .domain(['Connected Theme'])
      .domain(ConnectedTheme)     
      .range([margin.top+50, svgHeight-margin.bottom]);
    svg
    .selectAll('.axis--y')
    .data([null])
    .join('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yAxisV2).tickSize(0))
      .select('path')
      .remove();
    svg
      .selectAll('.axisLabelY')
      .data([null])
      .join('text')
      .attr('class', 'axisLabelY axisLabel')
      .text('Connected Theme')
      .attr('transform', 'rotate(-90)') // Rotate the text 90 degrees counterclockwise
      .attr('x', -400) // Adjust x to position it closer to the left
      .attr('y', 30) // Adjust y to move it to the correct vertical position
      .attr('text-anchor', 'middle') // Center the text along the rotated axis
      .attr('dy', '-1em'); // Adjust the vertical offset


    const gridlinesGroup = svg.selectAll('.gridlinesGroup')
    .data([null])
    .join('g')
    .attr('class','gridlinesGroup' )
    // Gridlines X Axis
    gridlinesGroup.selectAll('.gridlinesX')
    // .data(sortedTheme)
    .data(uniqueTheme)
    .join('line')
    .attr('class', 'gridlinesX')
    .attr('y1', margin.top+25)
    .attr('y2', svgHeight-margin.bottom)
    .attr('x1',d=> xAxisV2(d))
    .attr('x2', d=> xAxisV2(d))
    .attr('opacity',.5)
    .attr('stroke-width', "1px")
    .attr('stroke-dasharray', "3 3")
    .attr('stroke', '#C5C5C5');


    //Gridlines Y Axis
    gridlinesGroup.selectAll('.gridlinesY')
    // .data(sortedConnectedTheme)
    // .data(['Connected Theme'])
    .data(uniqueConnectedTheme)
    .join('line')
    .attr('class', 'gridlinesY')
    .attr('y1', d=> yAxisV2(d))
    .attr('y2', d=> yAxisV2(d))
    .attr('x1', margin.left)
    .attr('x2', svgWidth-margin.right)
    .attr('opacity', 0.5)
    .attr('stroke-width', '1px')
    .attr('stroke-dasharray', '3 3')
    .attr('stroke', '#C5C5C5');




    
    // Circles within the matrix
    const circles = svg
      .selectAll('.dataPoints')
      .data(data)
      .join('circle')
      .attr('class', 'dataPoints')
      .attr('cy', (d) => yAxisV2(d['Connected Theme']))
      .attr('cx', (d) => xAxisV2(d.Theme))
      .attr('r', (d) => d['Type of Relationship']==="Driver" ? 20 : 10)
      .attr('opacity', 1)
      .attr('fill', (d) => colour(d.Sentiment))
      .on('mouseover', (event, d) => {
        tooltip
          .html(
            '<span class="tooltipTitle">Theme: ' +
              d.Theme +
              ' | Connected Theme : ' +
              d['Connected Theme'] +
              '</span><br>' +
              d.Description,
          )
          .style('opacity', 1)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });


    // Data Labels / description
    const dataLabels = svg
    .selectAll('.dataLabels')
    .data(data)
    .join('text')
    .attr('class', 'dataLabels')
    .attr('x', (d) => {
      if (xAxisV2(d.Theme)<svgWidth/2){
        return xAxisV2(d.Theme)+25;
      } else {
        return xAxisV2(d.Theme)-25;
      }
      })
    .attr('y', (d) => yAxisV2(d['Connected Theme']))
    .attr('text-anchor', (d) => {
      if (xAxisV2(d.Theme)<svgWidth/2){
        return 'start';
      } else {
        return 'end';
      }
    })
    // .attr('dy', '.35em') //helps centre it 
    .attr('opacity', 0)
    .text((d) => {
      // Ensure the apostrophes are encoded
      return d.Description.replace(/'/g, "&#39;");
    })
    .call(wrap, 400);
    


    // Variable to keep track of the currently selected Driver / Theme
    let selectedConnectedTheme = null;
    let selectedTheme = null;
    
    // Add the y-axis (driver) labels click event
    svg
      .selectAll('.axis--y .tick text') // Target only the y-axis labels
      .style('cursor', 'pointer')
      .on('click', function (event, d) {
        // Add click event listener for y-axis labels (drivers)
        // If the same driver is clicked again, reset all circles to full opacity
        if (selectedConnectedTheme === d) {
          circles
            .transition()
            .duration(300)
            .style('opacity', 1); // Reset all circles
            selectedConnectedTheme = null; // Deselect driver

            svg
            .selectAll('.axis--y .tick text')
            .transition()
            .duration(300)
            .style('opacity',1); // Reset all Y axis labels

            svg.selectAll('.axis--x .tick text')
            .transition()
            .duration(300)
            .style('opacity',1); // Reset all X axis labels 


        } else {
          // Highlight the circles for the selected driver (y-axis column)
          circles
            .transition()
            .duration(300)
            .style('opacity', (circleData) =>
              // circleData['Connected Theme'] === d ? 1 : 0.1,
            circleData['Connected Theme'] === d ? 1 : 0.1,
            ); // Dim other circles, highlight the selected ones
            selectedConnectedTheme = d; // Store selected driver

            svg
            .selectAll('.axis--y .tick text')
            .transition()
            .duration(300)
            .style('opacity', (text) => text===d ? 1 : 0.1);

            svg
            .selectAll('.axis--x .tick text')
            .transition()
            .duration(300)
            .style('opacity', (text) => 
              circles.filter((circleData)=> circleData['Connected Theme'] ===d && circleData['Theme']===text)
          .size()> 0 ? 1 : 0.1,
        );
            



        }
      });
    
    // Add the x-axis (theme) labels click event
    svg
      .selectAll('.axis--x .tick text') // Select all x-axis (theme) labels
      .style('cursor', 'pointer') // Change cursor to indicate clickability
      .on('click', function (event, d) {
        // Add click event listener for x-axis labels (themes)
        // If the same theme is clicked again, reset all circles to full opacity
        if (selectedTheme === d) {
          circles
            .transition()
            .duration(300)
            .style('opacity', 1); // Reset all circles

            svg
            .selectAll('.axis--x .tick text')
            .transition()
            .duration(300)
            .style('opacity', 1); 

            svg
            .selectAll('.axis--y .tick text')
            .transition()
            .duration(300)
            .style('opacity', 1);

            svg
            .selectAll('.gridlinesX')
            .transition()
            .duration(300)
            .style('opacity', 0.5);

            svg
            .selectAll('.gridlinesY')
            .transition()
            .duration(300)
            .style('opacity', 0.5);


            dataLabels
            .transition()
            .duration(300)
            .style('opacity', 0);


          selectedTheme = null; // Deselect theme
        } else {
          // Highlight the circles for the selected theme (x-axis column)
          circles
            .transition()
            .duration(300)
            .style('opacity', (circleData) =>
              circleData.Theme === d ? 1 : 0.1,
            ); // Dim other circles, highlight the selected ones

            selectedTheme = d; // Store selected theme
            // selectedDriver = null; // Deselect any driver selection

            svg
            .selectAll('.axis--x .tick text')
            .transition()
            .duration(300)
            .style('opacity', (text) => text===d ? 1 : 0.1);

            svg
            .selectAll('.axis--y .tick text')
            .transition()
            .duration(300)
            .style('opacity', (text) =>
              circles
              .filter((circleData) => circleData.Theme === d && circleData['Connected Theme'] === text)
              .size() > 0 ? 1 : 0.1,
            ); // Dim the other Y-axis labels, highlight the ones corresponding to the selected theme

          svg
          .selectAll('.gridlinesX')
          .transition()
          .duration(300)
          .style('opacity', (line) => line === d ? 0.7: 0.2);

          svg
          .selectAll('.gridlinesY')
          .transition()
          .duration(300)
          .style('opacity', 0.2);

          dataLabels
          .transition()
          .duration(800)
          .style('opacity', (textData) =>
            circles
            .filter((circleData) => circleData.Theme === d && circleData['Description'] === textData.Description)
            .size() > 0 ? 1 : 0,);
        }
      });
    }