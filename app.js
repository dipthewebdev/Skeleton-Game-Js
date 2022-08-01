document.addEventListener('DOMContentLoaded', () => {
   const grid = document.querySelector('.grid')
   const skeleton = (document.createElement('div'))
   let skeletonLeftSpace = 50
   let startPoint = 150
   let skeletonBottomSpace = startPoint
   let platformCount = 5
   let platforms=[]
   let upTimerInterval
   let downTimerInterval
   let isJumping = true
   let isGameOver = false
   let score = 0
   let isGoingLeft = false
   let isGoingRight = false
   let leftTimerInterval
   let rightTimerInterval

   


   function createSkeleton() {
       grid.appendChild(skeleton)
       skeleton.classList.add('skeleton')
       skeletonLeftSpace = platforms[0].left
       skeleton.style.left = skeletonLeftSpace + 'px'
       skeleton.style.bottom = skeletonBottomSpace + 'px'

   }

   class Platform {
       constructor(platformButton) {
           this.bottom = platformButton
           this.left = Math.random() * 315
           this.visual = document.createElement('div')

           const visual = this.visual
           visual.classList.add('platform')
           visual.style.left = this.left + 'px'
           visual.style.bottom = this.bottom + 'px'
           grid.appendChild(visual)
       }
   }

   function createPlatforms() {
       for (let i = 0; i < platformCount; i++){
           let platformGap = 600 / platformCount
           let newPlatformBottom = 100 + i * platformGap
           let newPlatform = new Platform(newPlatformBottom)
           platforms.push(newPlatform)
       }
   }

   function movePlatforms(){
       if(skeletonBottomSpace > 200) {
           platforms.forEach(platform => {
               platform.bottom -= 4
               let visual = platform.visual
               visual.style.bottom = platform.bottom + 'px'

               if(platform.bottom < 10){
                   let firstPlatform = platforms[0].visual
                   firstPlatform.classList.remove('platform')
                   platforms.shift()
                   let newPlatform = new Platform(600)
                   platforms.push(newPlatform)
                   score++
               }
           })
       }
   }

   function jump() {
    clearInterval(downTimerInterval)
    isJumping = true
    upTimerInterval = setInterval(function() {
        skeletonBottomSpace += 20
        skeleton.style.bottom = skeletonBottomSpace + 'px'
        if(skeletonBottomSpace > startPoint + 200) {
            fall()
        }
    }, 30)
   }

   function fall() {
    clearInterval(upTimerInterval)
    isJumping = false
    downTimerInterval = setInterval(function() {
        skeletonBottomSpace -= 5
        skeleton.style.bottom = skeletonBottomSpace + 'px'
        if(skeletonBottomSpace <= 0) {
            gameOver()
        }

        platforms.forEach(platform => {
            if(
                (skeletonBottomSpace >= platform.bottom) && 
                (skeletonBottomSpace <= platform.bottom + 15) && 
                ((skeletonLeftSpace + 60) >= platform.left) &&
                (skeletonLeftSpace <= (platform.left + 85)) &&
                !isJumping
            ) {
                startPoint = skeletonBottomSpace
                jump()
            }
        })
    }, 30)
   }

   function gameOver(){
       isGameOver = true
       while(grid.firstChild) {
           grid.removeChild(grid.firstChild)
       }
       grid.innerHTML = score
       clearInterval(upTimerInterval)
       clearInterval(downTimerInterval)
   }

   function control(e) {
     if(e.key === "ArrowLeft"){
         moveLeft()
     } else if(e.key === "ArrowRight") {
         moveRight()
     } else if(e.key === "ArrowUp") {
         moveStraight()
     }
   }

   function moveLeft() {
        if(isGoingRight) {
            clearInterval(rightTimerInterval)
            isGoingRight = false
        }
        isGoingLeft = true
        isTimerInterval = setInterval(function () {
            if (skeletonLeftSpace >= 0) {
                skeletonLeftSpace -= 5
                skeleton.style.left = skeletonLeftSpace + 'px'
            } else moveRight()
        }, 30)
   }

   function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerInterval)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerInterval = setInterval(function () {
            if(skeletonLeftSpace <= 340) {
                skeletonLeftSpace += 5
                skeleton.style.left = skeletonLeftSpace + 'px'
            } else moveLeft()
        }, 30)
   }

   function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerInterval)
        clearInterval(rightTimerInterval)
   }

   function start() {
        if(!isGameOver){
            createPlatforms()
            createSkeleton()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control )
        }
    }

   start()
})