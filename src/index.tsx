import React, { useState, useContext, useEffect } from 'react'
import { render } from 'react-dom'
import './styles.css'
import Stage from './components/Stage'
import { useAnimation } from './hooks'

enum Section {
  Stage = '#the-stage',
  Pixels = '#pixels',
  Rectangles = '#rectangles',
  Circles = '#circles',
  Sprites = '#sprites',
  Text = '#text',
  Animations = '#animations',
}

function App() {
  const initialSection = (window.location.hash as Section) || Section.Stage
  const [section, setSection] = useState(initialSection)
  const goto = (x: Section) => () => setSection(x)
  return (
    <div>
      <div className="content">
        <h1>Getting Started</h1>
        <h2>Installation</h2>
        <p>
          You can install <code>pixel8</code> with <code>yarn</code> or{' '}
          <code>npm</code>:
        </p>
        <pre>
          <code>yarn add pixel8 # or npm install pixel8</code>
        </pre>
        <hr />
        <h2>Usage</h2>
        {section === Section.Stage && <TheStageSection />}
        {section === Section.Pixels && <PixelsSection />}
        {section === Section.Rectangles && <RectanglesSection />}
        {section === Section.Circles && <CirclesSection />}
        {section === Section.Sprites && <SpritesSection />}
        {section === Section.Text && <TextSection />}
        {section === Section.Animations && <AnimationsSection />}
      </div>
      <div className="left-sidebar">
        <a href={Section.Stage} onClick={goto(Section.Stage)}>
          The Stage
        </a>
        <a href={Section.Pixels} onClick={goto(Section.Pixels)}>
          Pixels
        </a>
        <a href={Section.Rectangles} onClick={goto(Section.Rectangles)}>
          Rectangles
        </a>
        <a href={Section.Circles} onClick={goto(Section.Circles)}>
          Circles
        </a>
        <a href={Section.Sprites} onClick={goto(Section.Sprites)}>
          Sprites
        </a>
        <a href={Section.Text} onClick={goto(Section.Text)}>
          Text
        </a>
        <a href={Section.Animations} onClick={goto(Section.Animations)}>
          Animations
        </a>
      </div>
    </div>
  )
}

function TheStageSection() {
  return (
    <div id="the-stage">
      <h3>The Stage</h3>
      <p>
        <code className="no-bg">{`import { Stage } from 'pixel8'`}</code>
      </p>
      <h4>
        <code>{'<Stage>'}</code>
      </h4>
      <p>
        The magical gateway into the world of pixel awesomeness (づ￣ ³￣)づ
      </p>
      <div className="preview">
        <Stage background="#000" />
        <Stage background="#eee" gridSize={8} gridColor="#f5f5f5" />
        <Stage
          background="#ddd"
          gridType="dotted"
          gridSize={8}
          gridColor="#ccc"
        />
        <Stage
          width={16}
          height={16}
          scale={8}
          background="pink"
          gridSize={1}
          gridColor="#fff"
        />
        <Stage
          width={16}
          height={16}
          scale={8}
          background="#8959a8"
          gridType="dotted"
          gridSize={1}
          gridColor="#fff"
        />
      </div>
      {/* prettier-ignore */}
      <pre><code>
      TODO:{'\n'}
      -----{'\n'}
      - [ ] background image tiling{'\n'}
      - [ ] interactive events onClick{'\n'}
      - [ ] ref (to get external access to the underlying canvas, etc)
      </code></pre>
    </div>
  )
}

function PixelsSection() {
  const [state, setState] = useState({ to: 0 })
  const pixels = [
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 2, y: 2 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 5, y: 3 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 2, y: 5 },
    { x: 4, y: 5 },
    { x: 5, y: 5 },
    { x: 1, y: 6 },
  ]
  return (
    <div id="pixels">
      <h3>Pixels</h3>
      <p>
        <code className="no-bg">{`no import required =)`}</code>
      </p>
      <h4>
        <code>{'<pixel>'}</code>
      </h4>
      <p>Let's create some 1-bit art:</p>
      <div className="preview">
        {/*
         * 1-bit smiley
         */}
        <Stage
          width={8}
          height={8}
          scale={8}
          fps={0}
          gridColor="#f4f4f4"
          background="#fff"
        >
          <pixel x={2} y={0} fill="#000" />
          <pixel x={5} y={0} fill="#000" />
          <pixel x={2} y={1} fill="#000" />
          <pixel x={5} y={1} fill="#000" />
          <pixel x={2} y={2} fill="#000" />
          <pixel x={5} y={2} fill="#000" />
          <pixel x={1} y={4} fill="#000" />
          <pixel x={6} y={4} fill="#000" />
          <pixel x={2} y={5} fill="#000" />
          <pixel x={3} y={5} fill="#000" />
          <pixel x={4} y={5} fill="#000" />
          <pixel x={5} y={5} fill="#000" />
          <pixel x={3} y={6} fill="#000" />
          <pixel x={4} y={6} fill="#000" />
        </Stage>
        {/*
         * 1-bit heart
         */}
        <Stage
          width={8}
          height={8}
          scale={8}
          fps={0}
          gridColor="#f4f4f4"
          background="#fff"
        >
          <pixel x={1} y={1} fill="#000" />
          <pixel x={2} y={1} fill="#000" />
          <pixel x={5} y={1} fill="#000" />
          <pixel x={6} y={1} fill="#000" />
          <pixel x={0} y={2} fill="#000" />
          <pixel x={1} y={2} fill="#000" />
          <pixel x={2} y={2} fill="#000" />
          <pixel x={3} y={2} fill="#000" />
          <pixel x={4} y={2} fill="#000" />
          <pixel x={5} y={2} fill="#000" />
          <pixel x={6} y={2} fill="#000" />
          <pixel x={7} y={2} fill="#000" />
          <pixel x={1} y={3} fill="#000" />
          <pixel x={2} y={3} fill="#000" />
          <pixel x={3} y={3} fill="#000" />
          <pixel x={4} y={3} fill="#000" />
          <pixel x={5} y={3} fill="#000" />
          <pixel x={6} y={3} fill="#000" />
          <pixel x={2} y={4} fill="#000" />
          <pixel x={3} y={4} fill="#000" />
          <pixel x={4} y={4} fill="#000" />
          <pixel x={5} y={4} fill="#000" />
          <pixel x={3} y={5} fill="#000" />
          <pixel x={4} y={5} fill="#000" />
        </Stage>
        {/*
         * 1-bit sword
         */}
        <Stage
          width={8}
          height={8}
          scale={8}
          fps={0}
          gridColor="#f4f4f4"
          background="#fff"
        >
          <pixel x={6} y={0} fill="#000" />
          <pixel x={7} y={0} fill="#000" />
          <pixel x={5} y={1} fill="#000" />
          <pixel x={6} y={1} fill="#000" />
          <pixel x={7} y={1} fill="#000" />
          <pixel x={2} y={2} fill="#000" />
          <pixel x={4} y={2} fill="#000" />
          <pixel x={5} y={2} fill="#000" />
          <pixel x={6} y={2} fill="#000" />
          <pixel x={2} y={3} fill="#000" />
          <pixel x={3} y={3} fill="#000" />
          <pixel x={5} y={3} fill="#000" />
          <pixel x={3} y={4} fill="#000" />
          <pixel x={4} y={4} fill="#000" />
          <pixel x={2} y={5} fill="#000" />
          <pixel x={4} y={5} fill="#000" />
          <pixel x={5} y={5} fill="#000" />
          <pixel x={1} y={6} fill="#000" />
        </Stage>
      </div>
      <p>
        Looking good! Hand-coding those pixels was pretty exhausting. How about
        we map over the pixels instead and do a cool time-lapse thing to spice
        it up a bit?
      </p>
      <div className="preview">
        <Stage
          width={8}
          height={8}
          scale={8}
          fps={10}
          gridColor="#f4f4f4"
          background="#fff"
          onTick={() => {
            setState({ to: (state.to + 1) % (pixels.length + 1) })
          }}
        >
          {pixels.slice(0, state.to).map(({ x, y }, i) => (
            <pixel key={`${x},${y}`} x={x} y={y} fill="#000" />
          ))}
        </Stage>
      </div>
    </div>
  )
}

function RectanglesSection() {
  return (
    <div id="rectangles">
      <h3>Rectangles</h3>
      <p>
        <code className="no-bg">{`no import required =)`}</code>
      </p>
      <h4>
        <code>{'<rect>'}</code>
      </h4>
      <p>Everybody {'<3'}s a good ole rectangle-bot:</p>
      <div className="preview">
        <Stage
          width={64}
          height={64}
          scale={8}
          fps={0}
          gridColor="#f4f4f4"
          background="#fff"
        >
          <rect
            x={0}
            y={0}
            height={8}
            width={32}
            fill="rgba(255, 119, 168, 1)"
            borderRadius={0}
          />
          <rect
            x={48}
            y={10}
            height={8}
            width={4}
            fill="rgba(131, 118, 156, 1)"
            borderRadius={0}
          />
          {/* robot */}
          <rect
            x={64 / 2 - 8}
            y={64 / 2 - 8}
            height={16}
            width={16}
            fill="rgba(194, 195, 199, 1)"
            borderRadius={1}
          >
            {/* eyes */}
            <rect
              x={2}
              y={4}
              height={6}
              width={4}
              fill="rgba(255, 0, 77, 1)"
              borderRadius={1}
            />
            <rect
              x={10}
              y={4}
              height={6}
              width={4}
              fill="rgba(255, 0, 77, 1)"
              borderRadius={1}
            />
            {/* "ears" */}
            <rect
              x={-2}
              y={4}
              height={8}
              width={2}
              fill="rgba(95, 87, 79, 1)"
              borderRadius={0}
            />
            <rect
              x={-2}
              y={-2}
              height={8}
              width={1}
              fill="rgba(194, 1955, 199, 1)"
              borderRadius={0}
            />
            <rect
              x={16}
              y={4}
              height={8}
              width={2}
              fill="rgba(95, 87, 79, 1)"
              borderRadius={0}
            />
            <rect
              x={17}
              y={-2}
              height={8}
              width={1}
              fill="rgba(194, 1955, 199, 1)"
              borderRadius={0}
            />
            {/* mouth */}
            <rect
              x={2}
              y={12}
              height={1}
              width={12}
              fill="rgba(95, 87, 79, 1)"
              borderRadius={0}
            />
          </rect>
        </Stage>
      </div>
      {/* prettier-ignore */}
      <pre><code>
        TODO:{'\n'}
        -----{'\n'}
        - [ ] border-radius{'\n'}
        - [ ] border{'\n'}
      </code></pre>
    </div>
  )
}

function CirclesSection() {
  return (
    <div id="circles">
      <h3>Circles</h3>
      <p>
        <code className="no-bg">{`no import required =)`}</code>
      </p>
      <h4>
        <code>{'<circ>'}</code>
      </h4>
      <p>Circle...bear...Why not? ¯\_(ツ)_/¯</p>
      <div className="preview">
        <Stage
          width={64}
          height={64}
          scale={8}
          fps={0}
          gridColor="#f4f4f4"
          background="#fff"
        >
          <circ x={0} y={0} radius={4} fill="rgba(29, 43, 83, 1)" />
          <circ
            x={64 / 2 - 8}
            y={64 / 2 - 8}
            radius={8}
            fill="rgba(0, 228, 54, 1)"
          />
          {/* face made with nested circles */}
          <circ x={36} y={4} radius={12} fill="rgba(255, 163, 0, 1)">
            {/* ears */}
            <circ x={-4} y={-4} radius={6} fill="rgba(255, 163, 0, 1)" />
            <circ x={-2} y={-2} radius={4} fill="rgba(255, 204, 170, 1)" />
            <circ x={16} y={-4} radius={6} fill="rgba(255, 163, 0, 1)" />
            <circ x={18} y={-2} radius={4} fill="rgba(255, 204, 170, 1)" />
            {/* eyes */}
            <circ x={4} y={6} radius={4} fill="rgba(255, 241, 232, 1)" />
            <circ x={12} y={6} radius={4} fill="rgba(255, 241, 232, 1)" />
            <circ x={4} y={6} radius={2} fill="rgba(29, 43, 83, 1)" />
            <circ x={12} y={6} radius={2} fill="rgba(29, 43, 83, 1)" />
            {/* nose */}
            <circ x={10} y={11} radius={2} fill="rgba(0, 0, 0, 1)" />
            {/* mouth */}
            <circ x={9} y={16} radius={3} fill="rgba(126, 37, 83, 1)" />
          </circ>
        </Stage>
      </div>
      {/* prettier-ignore */}
      <pre><code>
        TODO:{'\n'}
        -----{'\n'}
        - [ ] border{'\n'}
        - [ ] should probably make an ellipse component too{'\n'}
      </code></pre>
    </div>
  )
}

function SpritesSection() {
  return (
    <div id="sprites">
      <h3>Sprites</h3>
      <p>
        <code className="no-bg">{`no import required =)`}</code>
      </p>
      <p>TODO</p>
      <div className="preview">{/*  */}</div>
    </div>
  )
}

function TextSection() {
  return (
    <div id="text">
      <h3>Text</h3>
      <p>
        <code className="no-bg">{`no import required =)`}</code>
      </p>
      <p>TODO</p>
      <div className="preview">{/*  */}</div>
    </div>
  )
}

function AnimationsSection() {
  const [x, animateX] = useAnimation({
    from: 0,
    to: 1,
    duration: 120,
    delay: 24,
    alternate: true,
    ease: 'easeInOutQuad',
  })
  const [y, animateY] = useAnimation({
    from: 9,
    to: -9,
    duration: 16,
    delay: 0,
    alternate: true,
    ease: 'easeInOutQuart',
  })
  const [fill, animateFill] = useAnimation({
    from: 'rgba(41, 173, 255, 0)',
    to: 'rgba(255, 173, 255, 1)',
    duration: 144,
    alternate: true,
    ease: 'linear',
  })
  const animate = () => {
    animateX()
    animateY()
    animateFill()
  }
  return (
    <div id="animations">
      <h3>Animations</h3>
      <p>
        <code className="no-bg">{`import { useAnimation } from 'pixel8'`}</code>
      </p>
      <p>Animating stuff is fairly straightforward with React Hooks:</p>
      <div className="preview">
        <Stage
          width={128}
          height={128}
          scale={4}
          fps={60}
          background="#fff"
          onTick={animate}
        >
          <rect fill="rgba(0, 0, 0, .05)" x={0} y={64} height={1} width={128} />
          <rect fill={fill} x={x * 119} y={y + 60} height={9} width={9} />
        </Stage>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
