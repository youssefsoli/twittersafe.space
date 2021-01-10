import React from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = React.useRef();

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
};

const tick = () => {
    d3.selectAll('.circ')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
};

const Graph = ({ tweetData, setTweetObj, setTweetLoading }) => {
    const ref = useD3(
        (svg) => {
            let xScale = d3.scaleLinear().domain([-1, 1]).range([50, 950]);
            let color = d3
                .scaleLinear()
                .domain([-1, 0, 1])
                .range(['#cc3d3d', '#ffffff', '#60b157']);
            let size = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(tweetData.calculatedTweets, (d) =>
                        Math.sqrt(d.magnitude)
                    ),
                ])
                .range([1, 13]);


            svg.append('line')
                .attr('x1', 50)
                .attr('x2', 950)
                .attr('y1', 150)
                .attr('y2', 150)
                .attr(
                    'style',
                    'stroke: rgba(222, 222, 230, 0.9); stroke-width: 1px;'
                );

            svg.append('line')
                .attr('x1', 500)
                .attr('x2', 500)
                .attr('y1', 0)
                .attr('y2', 280)
                .attr(
                    'style',
                    'stroke: rgba(222, 222, 230, 0.9); stroke-width: 1px;'
                );

            const legend = svg.append('g').attr("transform", "translate(100, 265)");
            const sizes = [5, 7, 9, 11, 13];
            legend.selectAll("circle")
                    .data(sizes)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d,i) { return d3.sum(sizes.slice(0,i+1)) * 2.5; })
                    .attr("r", function(d) { return d })
                    .attr('stroke', 'rgba(0, 0, 0, 0.5)')
                    .attr('fill', '#ffffff');
            
            svg.append('text')
                .attr('y', 295)
                .attr('x', 160)
                .text('Magnitude')
                .attr('fill', 'rgba(0, 0, 0, 0.5)')
                .attr("text-anchor", "middle")

            svg.append('line')
                .attr('x1', xScale(tweetData.averageScore))
                .attr('x2', xScale(tweetData.averageScore))
                .attr('y1', 0)
                .attr('y2', 280)
                .attr(
                    'style',
                    'stroke: black; stroke-width: 2px;'
                );

            
            svg.append('text')
                .attr('y', 295)
                .attr('x', xScale(tweetData.averageScore))
                .text('Average Sentiment')
                .attr("text-anchor", "middle")

            svg.selectAll('.circ')
                .data(tweetData.calculatedTweets)
                .enter()
                .append('circle')
                .attr('class', 'circ')
                .attr('stroke', 'black')
                .attr('fill', (d) => color(d.product))
                .attr('r', (d) => size(Math.sqrt(d.magnitude)))
                .attr('cx', (d) => xScale(d.score))
                .attr('cy', 150)
                .on('click', (e, d) => {
                    setTweetObj(false);
                    setTweetObj(d);
                    setTweetLoading(true);
                })
                .on('mouseover', function() {
                    d3.select(this).classed('active', true);
                })
                .on('mouseout', function() {
                    d3.select(this).classed('active', false);
                });

            let x_axis = d3.axisBottom().scale(xScale);
            svg.select('.x-axis').call(x_axis);

            let simulation = d3
                .forceSimulation(tweetData.calculatedTweets)
                .force(
                    'x',
                    d3.forceX((d) => {
                            return xScale(d.score);
                        })
                        .strength(3)
                )
                .force('y', d3.forceY(150).strength(1))

                .force(
                    'collide',
                    d3.forceCollide((d) => {
                        return size(d.magnitude);
                    })
                )
                .alphaDecay(0)
                .alpha(0.3)
                .on('tick', tick);

            simulation.alphaDecay(0.1);
        },
        [tweetData.calculatedTweets[0].id]
    );

    return (
        <svg
            ref={ref}
            style={{
                height: 300,
                width: 1000,
                marginRight: '0px',
                marginLeft: '0px',
            }}
        >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    );
};

export default Graph;
